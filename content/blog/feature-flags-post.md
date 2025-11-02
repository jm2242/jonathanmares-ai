---
title: Feature Flags at Quorum
date: 2021-12-24
excerpt: Architecture and evolution of Feature Flags at Quorum
tags: ["tech", "featureflags", "feature", "technology", "software"]
cover: ./feature-flags-quorum.jpg
---

For the last few years, feature flags have been an integral component of the development process at Quorum. Since the inception of the feature flag system, we have used feature flags to launch entire products and countless features to our customers. In this post, I'll walk you through what feature flags are, why we find them useful, and how we've built a robust feature flag system within our Postgres / Django / React stack that seamlessly integrates into our development and deployment processes.

_Originally published on [Medium](https://medium.com/qbits/feature-flags-at-quorum-7a6b5e230786). Full content backup below:_

---

# Feature Flags at Quorum

For the last few years, feature flags have been an integral component of the development process at Quorum. Since the inception of the feature flag system, we have used feature flags to launch entire products and countless features to our customers. In this post, I'll walk you through what feature flags are, why we find them useful, and how we've built a robust feature flag system within our Postgres / Django / React stack that seamlessly integrates into our development and deployment processes.

## Overview

Feature Flags - also known as Feature Toggles or Feature Flippers - are a set of techniques used to control the delivery of new functionality to users rapidly and safely¹. When used appropriately, feature flags allow developers to integrate unfinished, in progress, or otherwise not-ready-for-production code into production without negatively impacting the experience of users.

Feature Flags give us a way to write code that can be exposed to a subset of users

![Feature Flags Overview](/blog-images/feature-flags-overview.png)
*Feature Flags give us a way to write code that can be exposed to a subset of users*

In practice, Feature Flags are used in conditionals to determine what should happen at runtime based on the state of a feature flag for a given user:

```python
if new_feature_is_enabled:
    # give access to code
else:
    # prevent access to code
```

In the first part of this post, I want to discuss some of the use cases for feature flags. In the second half, I'll go over the design of our system.

## Use Case: Incremental Rollout

With proper use, a feature can be deployed to production behind a feature flag for a subset of users². This enables the Quorum team to quickly demo an experience to a client while it is still under active development. A feature can also be rolled out to an increasing number of users to collect feedback and fix issues before it is fully rolled out.

In the past, we were forced to launch separate servers running different versions of code in order to demo functionality. Before we used feature flags and deployed daily, we often had what we called the "Beta Server", which ran the newest version of Quorum. It was difficult to keep this server consistently in sync with production and we constantly fought merge conflicts. With feature flags, we are able to control releases to a subset of users and avoid all-or-nothing deployments. This also allowed us to eliminate the Beta Server from our deployment process.

## Use Case: Decouple Deployment from Launching Features

When developers can get code merged to production quickly, it eliminates the need to keep long-lived branches alive. In our experience, long-lived branches are a recipe for merge conflicts, increased regressions, and more deployment rollbacks. Deploying code behind a feature flag reduces the amount of new code that is released with each deployment. This enables us to make smaller, incremental changes to master.

![Releases used to be extremely large](/blog-images/feature-flags-releases.png)
*Releases used to be extremely large*

Before we started using feature flags, launching new features was often coupled to our deployment process. Nowadays, we first deploy the code we want to launch, make sure it doesn't break other parts of the application, and then toggle it on for our users. We often send out an email weeks in advance notifying our users exactly when the new feature/experience will be live. This consistency in delivery timeline gives users confidence in Quorum's ability to deliver new code and reduces stress on the engineering team.

## Use Case: Sharing Code with engineers

Code that lives on a branch and not on trunk is code that cannot be used by others. Deploying code behind a feature flag enables other engineers to get code more quickly to production even if it's not ready for clients to use. Others can use this code in their own development efforts³.

### News Monitoring — a practical example

In 2020, Quorum launched News Monitoring. Here's how we used feature flags to launch this product:

* We built out the dataset without exposing it to the frontend and feature flagged backend functionality
* We feature flagged the API Resources and frontend code, which prevented clients from using the product, but allowed us to begin testing and integrating with production throughout the development process
* Before officially launching, we rolled out the product to internal users at Quorum and then to a few clients for early access
* On the predetermined launch date, we enabled the functionality for all clients who purchased the product
* A short period of time after launch, we cleaned up the feature flag to keep the codebase clean.

## Things to Watch out For

When working with feature flags, the most commonly occurring problem is that non-polished, incomplete code can creep its way into production. This can lead to confusion among engineers — particularly when it's not clear which version of code should be used, or if an engineer needs to support multiple code pathways. This is exacerbated by long-living feature flags — ideally, feature flags should be remediated (cleaned up) as soon as possible.

Feature flags can be abused to create a complex dependency tree of feature flags. These can be extremely difficult to reason about and should be avoided at all costs. In 2019, we launched a large-scale overhaul of numerous interdependent features that spanned the entire application. Some of these feature flags were invoked over 300 times in the codebase. At one point, we had seven interdependent feature flags and needed to support at least four distinct application states. This ultimately resulted in bugs and timeline delays due to the hole we dug ourselves into. It's important to think about how feature flags can depend on one another — especially if they control code that is under active development. We have learned to avoid this trap by minimizing the situations where one feature flag can depend on another.

Feature flags also introduce additional complexity into the codebase and contribute to technical debt. In the project mentioned above, remediation took weeks to complete due to the number of places the feature flag appeared.

The amount of code that needs to be tested is often doubled. Since a feature flag may allow multiple paths of code execution, we must write and run tests for each additional code path a feature flag creates. To increase adoption of feature flags and engineering velocity, we've created testing utilities to make this process more straightforward.

There is also an associated performance cost with a feature flag system. If you are not careful, it is possible to adversely affect the client experience. We'll discuss some of the performance issues we have faced with our system in a later section.

Finally, if work behind a feature flag is abandoned and forgotten, it will never make its way to production and the team will have lost productivity.

## Architecture

Now that we've discussed the usefulness of feature flags and some best practices, let's dive into how we've built out our system at Quorum.

Let's begin with some of the requirements of the system:

* Easily create and remove feature flags
* Easily manage the state of feature flags from one centralized location
* Easily integrate into the development process
* The same feature flag can be used both on the frontend and backend
* Toggle feature flags for individual users or organizations⁴
* Should have a negligible performance impact on the experience for our clients

While there are some custom solutions available for purchase, we decided to roll our own. We were actually surprised how quickly we had an MVP up to test out. It did take us some time to work out some issues — more about those later.

### Database Layer

At the database layer, we have a feature flag table that is indexed uniquely by a slug. Each feature flag corresponds to an individual record in this table. Some of the important boolean configuration options are:

* Disabled for all users
* Enabled for all users
* Enabled for Quorum admins
* Can be toggled from the UI

Additionally, we have a through table for both Users and Organizations, which allows us to individually add either users or organizations on a per-feature flag basis.

Creating a feature flag is as simple as running the following code to insert a row into the `FeatureFlag` table:

```python
FeatureFlag.objects.create(
  slug="ff_some_cool_thing",
  description="A cool new feature people have been asking for"
)
```

Once the feature is completely remediated, the row can be removed from the table:

```python
flag = FeatureFlag.objects.get(slug="ff_some_cool_thing")
flag.delete()
```

This prevents this table from growing and keeps queries fast.

### Application Layer

The responsibility of the application layer with respect to feature flags is threefold — compute what feature flags are truthy for the user, facilitate the use of these feature flag values in application code, and make feature flag data available to the client.

To compute which feature flags should be enabled for a user, we query the feature flag table and check a few conditions:

* Is the feature flag enabled for all users?
* Is the feature flag enabled for Quorum admins and is the user a Quorum admin?
* Is the user explicitly enabled for this feature flag?
* Is the user's organization explicitly enabled for this feature flag?

If any of these conditions are true, we consider the feature flag to be enabled for the user. This is done in a single query with a few joins.

To make it easy for engineers to use feature flags in code, we've created a couple helper functions:

```python
def is_feature_enabled(slug, user):
    """Returns True if feature flag is enabled for user, False otherwise"""
    ...

def is_feature_enabled_for_org(slug, org):
    """Returns True if feature flag is enabled for organization, False otherwise"""
    ...
```

These helper functions can be imported anywhere in the Python codebase. Here's how we use them:

```python
from featureflags.helpers import is_feature_enabled

def some_function(request):
    user = request.user
    if is_feature_enabled("ff_some_cool_thing", user):
        # feature flagged code runs here
    else:
        # old code runs here
```

### Performance Considerations

Feature flag evaluations happen on every request. Without optimization, this could be extremely slow. To address this, we cache feature flag evaluations using Django's caching framework (which uses Memcached in production).

We've configured our cache evaluations to expire after 60 seconds in production. Nearly all of our requests complete within that time frame, which ensures that we are capturing as much computation as we can. We also didn't want to make this number too large because we still need to retain the ability to toggle features on/off for users in a timely fashion. We feel this is a good balance for a production environment.

**Future Improvements**

The Memcached process we use for caching feature flags enables us to drastically improve the performance of our feature flag system. However, there is still some room for improvement. Our load balancers operate with a round-robin scheme — if a client makes 10 separate network requests and we have 10 application servers running, each will be sent to a different instance. Since each instance has its own Django cache, feature flag results (and anything stored in each cache) cannot be shared across instances. The solution here is to host a standalone server for caching purposes that can be accessed by all instances simultaneously. The caveat here is the time to fetch cache results from the standalone server cannot be much longer than the time it would take to fetch cache results from a locally served cache.

### Client-Side

Similar to the backend helpers, we also created a function `isFeatureEnabled (String) => Boolean` that can be imported anywhere in JavaScript (and JSX) code. Unlike the backend functions though, it does not need a user. This is because we only send along the feature flags that are truthy for the client.

Here's how we use feature flags in rendering logic:

```javascript
import { isFeatureEnabled } from 'featureflags/helperFunctions'

render = () => {
  return (
    {isFeatureEnabled("ff_cool_new_thing") && <NewComponent />}
  )
}
```

Here's how we use feature flags in JavaScript code:

```javascript
import { isFeatureEnabled } from 'featureflags/helperFunctions'

someFunction = () => {
  if (isFeatureEnabled("ff_cool_new_thing")) {
    // feature flagged code run here
  }
}
```

Unlike the backend, there is no need to ask for the user as there is only a single user on the client side.

### User Interface

The final component of this system is the user interface that we expose to the entire Quorum team. One of the ways the feature flag UI is used is by the Business team to demo functionality to potential clients.

![Feature Flag UI](/blog-images/feature-flags-ui.png)
*One of the ways the feature flag UI is used is by the Business team to demo functionality to potential clients*

## Feature Flag Utilities

To effectively make use of feature flags, the code must "opt-in" to respecting feature flagged execution pathways. `If` statements are a simple way to respect feature flags. However, there are additional mechanisms we have introduced to integrate feature flags into our development environment both server and client-side.

### Server Side — Feature Flagging code for an organization

There are times when a `user` object is not in scope, but an `organization` is (for example, in our grassroots product). This enables us to turn a feature on for individual organizations, in addition to users.

### Server Side — Feature Flagging a Resource

We have made it simple to feature flag an entire resource, such as `api/somenewresource/`. We've created a `FeatureFlaggedResourceMixin` that can be inherited by the resource class and configured via a feature flag class variable. This prevents a user that does not have access to the feature flag from interacting with the endpoint.

### Server/Client Side — Feature Flagging an Enum

Enums and other compile time declaration are a little tricky to restrict access to. We've built a few systems, both server-side and client-side, that allow engineers to declare an enum value feature flagged. This prevents a user from "seeing" this enum on the client if they do not have access to the feature flag.

### Client-Side — Feature Flagging a Route

We've built a Higher Order Component (HOC) (a function with the signature `(Component) => Component` that adds some additional functionality to a `Component`). When used, it looks like:

```javascript
const QuorumRouter =
  <Provider store={store}>
    <Router history={reduxHistory}>
      <Route path="/" component={App} onEnter={checkEnterPermissions} onChange={checkExitPermissions}>
        ...
        <Route
          path={paths.newFeature}
          component={routeIsFeatureToggled(SomeNewFeatureContainer)}
          featureSlug="ff_some_new_feature"
        />
```

`routeIsFeatureToggled` makes use of `'redux-auth-wrapper/history3/redirect'` and is shown below:

```javascript
export const routeIsFeatureToggled = connectedRouterRedirect({
  redirectPath: "/home/",
  authenticatedSelector: (_, routerProps) =>
       isFeatureEnabled(routerProps.route.featureSlug),
  wrapperDisplayName: "UserIsFeatureToggled"
})
```

This HOC makes it easy to add new feature flagged routes that only let in users that have the feature flag enabled for them.

### Client-Side — Feature Flagging a Component

We've also built a HOC to feature flag an individual component. Its use looks something like:

```javascript
const FeatureFlaggedComponent = featureFlagComponent(SomeComponent, "ff_some_feature")
```

## Steps to Clean up a Feature Flag

Once a feature has been in production for some time, it's time to clean it up. Here are the steps:

1. **Remove code branches for the non-feature flagged code path(s) on the client**

This step basically integrates the new code into the codebase and removes the old path of code that should no longer be run. It's important to remove client-side code first to make it impossible for users to access the old version of the code. Use multiple PR's if there's lots of code.

2. **Remove code branches for the non-feature flagged code path(s) on the server**

Same as Step 1 — make it impossible to execute the non-feature flagged code path.

3. **Remove unneeded database fields/models**

If there are any database tables or fields that are no longer used, use this opportunity to eliminate them. First, remove their definitions in the codebase, then drop the fields or tables in the database.

4. **Delete the Feature Flag from the codebase**

Deleting the feature flag from the table indicates the feature is completely remediated. This prevents the feature flag from being pulled into every feature flag evaluation and keeps things tidy in the table.

## Best Practices

**Use Them!**

At Quorum, I'm consistently encouraging our developers to use feature flags more often. Make liberal use of feature flags in the following scenarios:

* Building a new feature (large or small) or product
* Introducing an experimental change
* Fixing a complicated bug with a risk of unexpected consequences

**Branch at the highest layer possible**

Use feature flags at the highest layer of the stack possible to minimize the number of conditionals needed. The more conditionals you use, the more branches of code you'll need to test. You'll also be introducing more code pathways which increases complexity. For example, if you are creating a brand new page, consider feature flagging the route rather than the rendered components themselves.

**Clean up (remediate) after yourself**

Don't keep code lying around for a long time. One of the consequences of code behind feature flags is it can be littered with conditionals. Do your fellow engineers a solid — make sure you tidy up after yourself. At Quorum, we have a slackbot that pings our `feature-flags` channel on a biweekly basis. We also hold a feature flag remediation morning once every few sprints to encourage engineers to spend time cleaning up.

**Name your slugs consistently**

As a team, we have decided to prefix all of our feature flags with `ff_` to make cleaning up simpler. We made this decision after finding it difficult to remediate feature flags that were named generically.

## Final Thoughts

Feature flags are a powerful tool that, when used appropriately, can dramatically improve the development process. They enable incremental rollouts, decouple deployment from launching features, and allow engineers to share code more quickly. However, they also introduce complexity and require discipline to maintain.

## Sources

[1]: Martin Fowler blog post on Feature Flags

[2] The term 'behind a feature flag' implies code that can be conditionally turned off via forcing the evaluation of an if statement to be `False` under certain conditions.

[3]: Trunk is a synonym for master. Trunk based development is the idea that branches off of the trunk are always kept small and are merged back into master often.

[4] We sell our product to an organization which is composed of users. each organization maps to an `Organization` object, which can have many `User`'s associated with it. Enabling feature flags on a per organization basis also allows us to use feature flags in our public facing features, such as external Sheets and Grassroots.

_Interested in working at Quorum and working on interesting things like our Feature Flag system? [We're hiring!](https://www.quorum.us/careers/)_
