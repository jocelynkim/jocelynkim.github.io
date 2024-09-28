---
layout: blog
title: shinji blog
---
<h2>Posts</h2>
<ul>
  {% for post in site.posts %}
    <falselink>{{ post.date | date: '%d/%m/%y' }}</falselink> <a href="{{ post.url }}"><reallink>{{ post.title }}</reallink></a> {{ post.excerpt }}<br>
  {% endfor %}
</ul>