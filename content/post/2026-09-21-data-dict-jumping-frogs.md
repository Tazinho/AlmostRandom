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

Apparently, you can rent a frog and enter a jumping competition. You might find yourself competing against teams with years or even decades of experience choosing and preparing theirs. Welcome to the Calaveras County Jumping Frog Jubilee. In [Astley et al. (2013)](https://doi.org/10.1242/jeb.090357), researchers studied bullfrog jumps at the event, comparing frogs rented by fairgoers with those entered by experienced teams. Their measurements now provide the example for the [Data Dict quickstart](https://data-dict.tidyverse.org/quickstart.html). That is a pretty good way to get me interested in data documentation.

<figure>
  <video controls playsinline preload="metadata" style="width: 100%; height: auto;">
    <source src="https://static-movie-usa.glencoesoftware.com/mp4/10.1242/79/6bbae3e84c93954e19c7bc76631c715d6bad8578/JEB090357-Video1.mp4" type="video/mp4">
    Your browser does not support embedded video.
  </video>
  <figcaption>
    Supplementary Movie 1 from Astley et al. (2013):
    <a href="https://doi.org/10.1242/jeb.090357">Chasing maximal performance: a cautionary tale from the celebrated jumping frogs of Calaveras County</a>.
    <em>Journal of Experimental Biology</em>, 216, 3947–3953.
    For more scenes from the competition, <a href="https://www.youtube.com/results?search_query=Calaveras+County+Jumping+Frog">browse videos on YouTube</a>.
  </figcaption>
</figure>

## Meet the data

How far can a bullfrog jump? Even with the [data in hand](https://github.com/hadley/frog-jumping), there is a detail worth checking: what counts as a jump? The [collection notes](https://github.com/hadley/frog-jumping/blob/main/data-collection.md) explain that the competition scored the straight-line distance across three successive jumps. The researchers measured individual jumps from video and excluded short, continuous movements called “skitters”. Same event, different measurements. That distinction belongs with the data wherever it goes. An AI agent asked to analyse those jumps needs that context just as much as a human does.

A data dictionary records what the data means: what each row represents, how values were measured and how tables fit together. [Data Dict](https://data-dict.tidyverse.org/) is an open-source project from [Hadley Wickham](https://github.com/hadley/data-dict.yaml), supported by Posit, that combines a format for writing this down with a command-line tool for putting it to use. You keep the descriptions and rules in a text file called `data-dict.yaml`. The tool can check the data against those rules and turn the file into documentation people can browse. It is [designed for teams working across R, Python and SQL](https://data-dict.tidyverse.org/who-why-when.html).

## Take a look

The [sea-otter dictionary](https://data-dict.tidyverse.org/examples/rendered/otters.html) shows what that looks like, without installing anything. One table describes the individual otters; another records the occasions on which measurements were collected for each animal. An otter caught twice can therefore have two measurement records. If you want to count animals, counting those records would give you the wrong answer. The dictionary explains the relationship and identifies the field that connects the tables. It also tells you that weight is measured in kilograms and openly records that one length measurement remains unexplained. That is the kind of detail I want close at hand: enough to use the data, including where to ask another question. You can compare the website with its [YAML source](https://data-dict.tidyverse.org/examples/otters.html), or explore the [example gallery](https://data-dict.tidyverse.org/examples/index.html).

The presentation matters too. A dictionary you can edit as text and share as a readable web page is easier to bring into everyday work, including conversations with colleagues who do not write code.

## Give it a jump

To try it yourself, start with the frog dataset. After [installing the CLI](https://data-dict.tidyverse.org/install.html), download the repository with Git and create a draft:

```sh
git clone https://github.com/hadley/frog-jumping
cd frog-jumping
data-dict draft frogs.parquet
```

This generates `data-dict.yaml` with information inferred from the data, such as column types, and TODOs for what still needs explaining. No agent is required. Open the file and use the collection notes to fill in descriptions and resolve the TODOs you can. Then check the data and create the documentation:

```sh
data-dict validate-data data-dict.yaml
data-dict render-spec data-dict.yaml
```

The result is a self-contained HTML page for the frog dictionary, like the otter example above. The [quickstart](https://data-dict.tidyverse.org/quickstart.html) walks through both commands. The [validation](https://data-dict.tidyverse.org/validate.html) acts as a set of tests for your data. Depending on the rules you declare, it can flag missing values, duplicate identifiers or references to records that do not exist. You can also require an end date to fall on or after its start date, using [SQL-, R- or Python-style syntax](https://data-dict.tidyverse.org/validate.html#expression-languages). These are supported subsets interpreted by Data Dict, rather than arbitrary code in those languages. A useful consequence: expectations written into the dictionary can be checked again when new data arrives.

## Let an agent help

If you would rather start with assistance, the quickstart offers an [agent-assisted route](https://data-dict.tidyverse.org/quickstart.html#ask-an-agent-to-draft-the-dictionary). Give an AI agent the data and collection notes, and ask it to document the dataset using the Data Dict CLI. The bundled instructions guide it through creating a draft, finding explanations in the notes and asking about anything it cannot resolve. That leaves a clear job for the person reviewing it: check whether the descriptions say what the data actually means. A plausible unit can still be the wrong unit, even when every test passes. Unresolved questions can stay visible as [`todos`](https://data-dict.tidyverse.org/spec.html#todo), ready for someone who knows the answer.

The dictionary can also help an AI tool use the data later. Posit's [querychat](https://opensource.posit.co/software/querychat/), which lets people ask questions about data in natural language, already [accepts Data Dict files](https://posit-dev.github.io/querychat/py/build.html#data-dictionary). Table descriptions, relationships and terminology give the model context for writing queries. That is a practical reason to maintain these explanations once and make them available beyond the original analysis.

## Keep an eye on it

Data Dict is still an early project. The CLI currently validates [Parquet files](https://data-dict.tidyverse.org/spec.html#source), with SQL sources planned for the future. There is also an open [proposal to generate sample data](https://github.com/tidyverse/data-dict/issues/20) from a dictionary. That could be handy for testing, although satisfying relationships between tables makes it a substantial task.

There are related approaches with different scopes. Within a dbt project, [documentation](https://docs.getdbt.com/docs/build/documentation) describes models and columns and shows dependencies between models, while [data tests](https://docs.getdbt.com/docs/build/data-tests) check declared assumptions. The [Open Data Contract Standard](https://bitol-io.github.io/open-data-contract-standard/latest/) goes beyond schema descriptions to include responsibilities and service-level agreements. The starting point explored here is smaller: a dictionary to describe a dataset, check expectations and share context with people and agents.

For a first experiment, though, the question is smaller: will the next person opening this dataset have an easier time understanding it? That person might be a colleague, an agent, or you six months from now. If a few descriptions and checks can save them some head-scratching, that is a useful jump forward.
