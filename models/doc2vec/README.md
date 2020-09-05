## doc2vec

## Require

`pip install gensim`

## Preprocessing

- Remove Non-Alphabetic 
  - e.g.  : , . \$ ( )^ - $ "
- Remove preposition 
  - e.g. for, a, of, the, and, to, in

## Settings

- dm = 0 (PV-DBOW)
- vector_size = 100
- window = 2
- min_count = 0
- workers = 4
- epoch = 10 

according to [https://radimrehurek.com/gensim/models/doc2vec.html](https://radimrehurek.com/gensim/models/doc2vec.html)
