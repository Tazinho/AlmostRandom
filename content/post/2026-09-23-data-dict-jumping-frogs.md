---
title: "Data dictionaries for humans, agents and jumping frogs"
author: "Malte Grosser"
date: '2026-09-23'
slug: data-dict-jumping-frogs
description: "Professional frog jumpers, helpful agents and better data documentation. A first look at data-dict, with examples to explore."
categories:
  - R
  - Python
  - SQL
  - R-bloggers
tags:
  - data-dict
  - data documentation
  - AI agents
draft: false
header:
  image: "headers/data-dict-jumping-frogs-header-v2.png"
---

Apparently, you can rent a frog and enter a jumping competition. You might find yourself competing against teams with years or even decades of experience choosing and preparing theirs. Welcome to the Calaveras County Jumping Frog Jubilee. In [Astley et al. (2013)](https://doi.org/10.1242/jeb.090357), researchers studied bullfrog jumps at the event, comparing frogs rented by fairgoers with those entered by experienced teams.[^jump-distance] Their measurements now provide the example for the [Data Dict quickstart](https://data-dict.tidyverse.org/quickstart.html). It is certainly a memorable way to get into data documentation.

<figure style="margin: 1rem 0 1.5rem;">
  <video controls playsinline preload="metadata" style="display: block; width: 100%; height: auto; margin: 0 0 0.5rem;">
    <source src="https://static-movie-usa.glencoesoftware.com/mp4/10.1242/79/6bbae3e84c93954e19c7bc76631c715d6bad8578/JEB090357-Video1.mp4" type="video/mp4">
    Your browser does not support embedded video.
  </video>
  <figcaption>
    Bullfrogs at the Calaveras County Jumping Frog Jubilee. Supporting video from
    <a href="https://doi.org/10.1242/jeb.090357">Astley et al. (2013)</a>.
  </figcaption>
</figure>

## Meet the data

How far can a bullfrog jump? Even with the [data in hand](https://github.com/hadley/frog-jumping), there is a detail worth checking: what counts as a jump? The [collection notes](https://github.com/hadley/frog-jumping/blob/main/data-collection.md) explain that the competition scored the straight-line distance across three successive jumps. The researchers measured individual jumps from video and excluded short, continuous movements called “skitters”. Same event, different measurements. That distinction belongs with the data wherever it goes. An AI agent asked to analyse those jumps needs that context just as much as a human does.

The context includes how the data was obtained. The measurements come from a live-animal competition, and the [collection notes](https://github.com/hadley/frog-jumping/blob/main/data-collection.md) describe [how participants prompt the frogs to jump](https://journals.biologists.com/jeb/article/216/21/3947/11669/Chasing-maximal-performance-a-cautionary-tale-from). For me, that raises animal-welfare concerns alongside the curiosity of the example.[^frog-welfare] That is part of the provenance too, and worth keeping visible rather than treating the event as just a quirky backdrop.

A data dictionary records what each row represents, how values were measured and how tables fit together. [Data Dict](https://data-dict.tidyverse.org/), an open-source project from [Hadley Wickham](https://github.com/hadley/data-dict.yaml) supported by Posit, combines a format for those descriptions with a command-line tool. You write descriptions and rules in `data-dict.yaml`; the tool checks the data against those rules and renders readable documentation. It is [designed for teams working across R, Python and SQL](https://data-dict.tidyverse.org/who-why-when.html).

## Take a look

To see how a dictionary handles several related tables, take a short detour from frogs to otters. The [sea-otter example](https://data-dict.tidyverse.org/examples/rendered/otters.html) is already rendered, so you can browse it without installing anything. One table describes the animals; another records the occasions on which measurements were collected. An otter caught twice can have two records, so counting those records would overcount animals. The dictionary explains how the tables connect, gives weight in kilograms and flags an unexplained length measurement. That is the detail I want close at hand, including where to ask another question.

Compare it with the [YAML source](https://data-dict.tidyverse.org/examples/otters.html), or browse the [example gallery](https://data-dict.tidyverse.org/examples/index.html). Being able to edit the dictionary as text and share it as a web page makes it accessible to colleagues who do not write code too.

## Give it a jump

To try the frog example, [install the CLI](https://data-dict.tidyverse.org/install.html), then clone the repository and create a draft:

```sh
git clone https://github.com/hadley/frog-jumping
cd frog-jumping
data-dict draft frogs.parquet
```

This creates `data-dict.yaml` with inferred column types and TODOs for missing explanations. No agent is required. Use the [collection notes](https://github.com/hadley/frog-jumping/blob/main/data-collection.md) to complete what you can, then check and render it:

```sh
data-dict validate-data data-dict.yaml
data-dict render-spec data-dict.yaml
```

The result is a self-contained HTML page, like the otter example. The [quickstart](https://data-dict.tidyverse.org/quickstart.html) explains both commands. The [validation](https://data-dict.tidyverse.org/validate.html) acts as a set of tests for your data. Depending on the rules you declare, it can flag missing values, duplicate identifiers or references to records that do not exist.

You can also require an end date to fall on or after its start date, using [SQL-, R- or Python-style syntax](https://data-dict.tidyverse.org/validate.html#expression-languages). These are supported subsets interpreted by Data Dict, rather than arbitrary code in those languages. A useful consequence: expectations written into the dictionary can be checked again when new data arrives.

## Let an agent help

The [agent-assisted route](https://data-dict.tidyverse.org/quickstart.html#ask-an-agent-to-draft-the-dictionary) starts with the same data and notes. Ask an agent to document them using the Data Dict CLI; the bundled instructions guide it through drafting and consulting the notes. Unresolved questions can remain as [`todos`](https://data-dict.tidyverse.org/spec.html#todo). Your job is to review the meaning: a plausible unit can still be wrong, even when every test passes.

The dictionary is useful to agents reading the data too. Posit's [querychat](https://opensource.posit.co/software/querychat/), which lets people ask questions about data in natural language, already [accepts Data Dict files](https://posit-dev.github.io/querychat/py/build.html#data-dictionary). Descriptions, relationships and terminology give the model context for writing queries, putting the same documentation to work beyond the original analysis.

## Keep an eye on it

Data Dict is still an early project. The CLI currently validates [Parquet files](https://data-dict.tidyverse.org/spec.html#source), with SQL sources planned for the future. There is also an open [proposal to generate sample data](https://github.com/tidyverse/data-dict/issues/20) from a dictionary. That could be handy for testing, although satisfying relationships between tables makes it a substantial task.

There are related approaches with different scopes. Within a dbt project, [documentation](https://docs.getdbt.com/docs/build/documentation) describes models and columns and shows dependencies between models, while [data tests](https://docs.getdbt.com/docs/build/data-tests) check declared assumptions. The [Open Data Contract Standard](https://bitol-io.github.io/open-data-contract-standard/latest/) goes beyond schema descriptions to include responsibilities and service-level agreements. The starting point explored here is more focused: a dictionary to describe a dataset, check expectations and share context with people and agents.

For a first experiment, though, the question is smaller: will the next person opening this dataset have an easier time understanding it? That person might be a colleague, an agent, or you six months from now. If a few descriptions and checks can save them some head-scratching, that is a useful jump forward.

[^jump-distance]: The longest bullfrog jump recorded in the study was 2.2 m, about 70% longer than the previously published maximum of 1.295 m. Of the 3,124 recorded jumps, 58% exceeded that earlier maximum. See [Astley et al. (2013)](https://doi.org/10.1242/jeb.090357).

[^frog-welfare]: The organisers also describe measures intended to support frog welfare, including housing and care arrangements during the event and a Frog Welfare Policy. See the [organisers' account](https://www.frogtown.org/frog-jump).
