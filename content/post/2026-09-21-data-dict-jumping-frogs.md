---
title: "Data dictionaries for humans, agents and jumping frogs"
author: "Malte Grosser"
date: '2026-09-21'
slug: data-dict-jumping-frogs
description: "Professional frog jumpers, helpful agents and better data documentation. A first look at data-dict, with examples to explore."
categories:
  - R
tags: []
draft: false
header:
  image: "headers/data-dict-jumping-frogs-header-v2.png"
---

Apparently, you can rent a frog and enter a jumping competition. You might find yourself competing against teams with decades of experience choosing and preparing theirs. Welcome to the Calaveras County Jumping Frog Jubilee.

In [Astley et al. (2013)](https://doi.org/10.1242/jeb.090357), researchers studied bullfrog jumps at the event, comparing frogs rented by fairgoers with those entered by experienced teams. Their measurements now provide the example for the [Data Dict quickstart](https://data-dict.tidyverse.org/quickstart.html). That is a pretty good way to get me interested in data documentation.

<figure>
  <video controls playsinline preload="metadata" style="width: 100%; height: auto;">
    <source src="https://static-movie-usa.glencoesoftware.com/mp4/10.1242/79/6bbae3e84c93954e19c7bc76631c715d6bad8578/JEB090357-Video1.mp4" type="video/mp4">
    Your browser does not support embedded video.
  </video>
  <figcaption>
    Supplementary Movie 1 from Astley et al. (2013):
    <a href="https://doi.org/10.1242/jeb.090357">Chasing maximal performance: a cautionary tale from the celebrated jumping frogs of Calaveras County</a>.
    <em>Journal of Experimental Biology</em>, 216, 3947–3953.
    <a href="https://static-movie-usa.glencoesoftware.com/mp4/10.1242/79/6bbae3e84c93954e19c7bc76631c715d6bad8578/JEB090357-Video1.mp4">Watch the video directly</a>.
  </figcaption>
</figure>

## Meet the data

Say someone sends you the [frog dataset](https://github.com/hadley/frog-jumping). Before comparing jumps, you need to know what was measured. One leap? Three in a row? Did every jump count? The [collection notes](https://github.com/hadley/frog-jumping/blob/main/data-collection.md) explain that the competition judged the straight-line distance across three successive jumps, while the researchers measured individual jumps from video. They also excluded certain short, continuous movements called “skitters”.

[`data-dict`](https://data-dict.tidyverse.org/) gives information like this a home alongside the data. A `data-dict.yaml` describes tables, columns, units and relationships. A command-line tool checks declared rules and turns the dictionary into a readable website. The project is [open source and supported by Posit](https://data-dict.tidyverse.org/who-why-when.html).

## Take a look

You can see the result without installing anything. Open the [sea-otter dictionary](https://data-dict.tidyverse.org/examples/rendered/otters.html), a separate example linked from the quickstart, and compare it with its [YAML source](https://data-dict.tidyverse.org/examples/otters.html). Start with `otters` and `measurements`. One describes animals, the other capture or collection events. An otter can appear in several events, connected through `otter_no`. Look at `weight` and you learn that it is measured in kilograms. Elsewhere, an unidentified length measurement is documented as still unexplained. That is useful documentation: you can find your way around the data, including the parts nobody has fully figured out. There are more examples in the [gallery](https://data-dict.tidyverse.org/examples/index.html).

The presentation matters. A feature can exist and still be cumbersome enough that nobody uses it. I have often appreciated the attention to usability in Hadley Wickham's tools and the wider tidyverse, reflected in its [design principles](https://design.tidyverse.org/). Data Dict's short route from a text file to something people can browse appeals to me for the same reason.

## Give it a jump

After [installing the CLI](https://data-dict.tidyverse.org/install.html), clone the frog repository and create a draft:

```sh
git clone https://github.com/hadley/frog-jumping
cd frog-jumping
data-dict draft frogs.parquet
```

Now open `data-dict.yaml`. Review the proposed descriptions and fill in the TODOs using the collection notes. Then check and render it:

```sh
data-dict validate-data data-dict.yaml
data-dict render-spec data-dict.yaml
```

This is the workflow from the [quickstart](https://data-dict.tidyverse.org/quickstart.html): draft, review, check, share. The result is a self-contained HTML page for your frog dictionary, like the otter example above.

The [checks](https://data-dict.tidyverse.org/validate.html) can flag missing values, duplicate identifiers and broken links between tables. You can also write your own rules in familiar [SQL-, R- or Python-style syntax](https://data-dict.tidyverse.org/validate.html#expression-languages). For example, an end date should not precede its start date. Supported expressions run through Data Dict's own engine, so these are subsets of the languages rather than arbitrary R or Python code.

## Let an agent help

The quickstart also offers an [agent-assisted route](https://data-dict.tidyverse.org/quickstart.html#ask-an-agent-to-draft-the-dictionary). Point an agent at the data and collection notes, and ask it to use the Data Dict CLI to document the dataset. The bundled instructions guide it through drafting, consulting the notes and raising unresolved questions.

I like that division of work. The agent can help turn the data and existing notes into structured metadata and leave unresolved points as [`todos`](https://data-dict.tidyverse.org/spec.html#todo). The CLI then does the less glamorous but important part: it deterministically checks whether the data matches the documented expectations and can render the dictionary as readable documentation. What remains unclear stays visible until someone who understands the data can resolve it.

## Keep an eye on it

Data Dict is still an early project. The current specification supports [Parquet sources](https://data-dict.tidyverse.org/spec.html#source), with SQL sources described as a future direction. There is also an open [proposal for generating sample data](https://github.com/tidyverse/data-dict/issues/20) from a dictionary. That could be handy for testing, although satisfying relationships between tables makes it a substantial task.

There is already useful work in this space, including the [Open Data Contract Standard](https://bitol-io.github.io/open-data-contract-standard/latest/) and [dbt's documentation and tests](https://www.getdbt.com/blog/what-is-data-lineage). For a team with established tooling, I would ask how a new dictionary can reuse what is already maintained.

For a first experiment, though, the question is smaller: will the next person opening this dataset have an easier time understanding it? That person might be a colleague, an agent, or you six months from now. If a few descriptions and checks can save them some head-scratching, that is a useful jump forward.
