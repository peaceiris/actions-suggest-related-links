## Suggest Related Links Action

A GitHub Action to suggest related or similar issues, documents, and links. Based on the power of NLP and fastText.



## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Models](#models)
  - [Data Collection](#data-collection)
  - [Preprocessing](#preprocessing)
  - [Train Model](#train-model)
  - [Find Similar Issues](#find-similar-issues)
  - [Suggest Issues](#suggest-issues)
- [Maintainers](#maintainers)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Models

Our GitHub Action is **actions-suggest-related-links**,  which suggests related or similar issues, documents, and links. 
This action mainly consists of 5 parts: Data Collection, Preprocessing, Train model, Find similar issues, and Suggest Issues.

![workflow](https://user-images.githubusercontent.com/39023477/93440029-37d64580-f90a-11ea-8e7b-625992aa0a58.jpg)

### Data Collection

All issues of the repository are collected in JSON format based on the `GitHub API`. Issues include the title, body, and comments. Training Data is regularly collected using the scheduling function and output as an artifact and saved as a cache.

### Preprocessing

We convert markdown to text based on `unifiedjs`. At this time, symbols that are not alphabetic characters are deleted.

- https://github.com/peaceiris/actions-suggest-related-links/blob/main/actions/src/preprocess.ts

### Train Model

When the new issue is updated, the model is trained based on `fasttext`. In accordance with its name, fasttest has the advantage of very short inference times. We think training at GitHub Actions won't be an issue of execution time. In fact, in [actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) repository, the training execution time was ???.

### Find Similar Issues

Calculate word vectors of training data and word vectors of posted data in fasttext. The cosine similarity is used to determine which word vectors of training data is close to the word vectors of the posted data. The higher the cosine similarity, the more similar the sentence.

### Suggest Issues



## Maintainers

- [peaceiris (Shohei Ueda)](https://github.com/peaceiris)
- [S-Kaisei (Kaisei Shimura)](https://github.com/S-Kaisei)



## License

MIT License

<div align="right"><a href="#table-of-contents">Back to TOC ☝️</a></div>
