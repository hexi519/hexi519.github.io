---
layout: default
active_key: home
---

{%- for section in site.data.links -%}
    <div class="ui vertical stripe links segment">
        {% if forloop.first %}{% include page_loading_progress_bar.html %}{% endif %}
        <div class="ui equal width stackable internally celled grid">
            <div class="center aligned row">
                {%- for category in section.categories -%}
                    <div class="links column">
                        <div class="ui top attached label">{{ category.name }}</div>
                        <div class="ui labels">
                            {% for link in category.links %}<a class="ui {{ link.style }} label" href="{{ link.url }}" target="_blank">{% if link.icon %}<i class="{{ link.icon }} icon"></i>{% endif %}{{ link.name }}</a>{% endfor %}
                        </div>
                    </div>
                {%- endfor -%}
            </div>
        </div>
    </div>
{%- endfor -%}