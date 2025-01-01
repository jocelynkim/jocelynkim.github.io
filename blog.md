---
layout: blog
title: shinji blog
---
<h1>Post Archive</h1>
<!---
fix height, view scrollbar, and bottom bar display
-->
<div style="height:300px;line-height:3em;overflow:scroll;padding:0.3em 0.3em 0.2em 0.3em;background-color:#FFF;border:0.05em dashed #28272A;border-radius: 0.5em;white-space:wrap;vertical-align:left;line-height:2em">
  <u2>
    {% for post in site.posts %}
      ✦ <falselink>{{ post.date | date: '%Y/%m/%d' }}</falselink> - <a href="{{ post.url }}"><reallink>{{ post.title }}</reallink></a>{{ post.excerpt }}
    {% endfor %}
  </u2>
</div>
<br>