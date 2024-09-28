---
layout: blog
title: shinji blog
---
<h1>Post Archive</h1>
<ul>
  {% for post in site.posts %}
    ✦ <falselink>{{ post.date | date: '%Y/%m/%d' }}</falselink> - <a href="{{ post.url }}"><reallink>{{ post.title }}</reallink></a>{{ post.excerpt }}<br>
  {% endfor %}
</ul>