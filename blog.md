---
layout: blog
title: blog
---
<h1>Post Archive</h1>
<!---
fix height, view scrollbar, and bottom bar display
-->
<div class="scrollbox scrollbox--big">
  <u2>
    {% for post in site.posts %}
      ✦ <falselink>{{ post.date | date: '%Y/%m/%d' }}</falselink> - <a href="{{ post.url }}"><reallink>{{ post.title }}</reallink></a>{{ post.excerpt }}
    {% endfor %}
  </u2>
</div>
<br>