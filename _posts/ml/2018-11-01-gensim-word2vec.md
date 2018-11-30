---
layout: post
title: 使用 gensim 训练 word2vec
category: ML
tag:
  - NLP
  - gensim
---



```python
import jieba
from gensim import models

fin = open('./text/笑傲江湖.txt', 'r', encoding='utf-8')

sentences = []

# 使用 jieba 对每个句子进行分词
for line in fin.readlines():
    sentences.append(list(jieba.cut(line)))

# 训练模型
model = models.word2vec.Word2Vec(sentences, size=50)

# 找出最相似的词
for item in model.most_similar('令狐冲', topn=10):
    print(item[0], item[1])

# 计算两个句子的相似度
sim = model.n_similarity(['令狐冲', '华山派', '岳不群'], ['任我行', '向问天', '日月神教'])


# 存储模型
model.save('XAJH.word2vec')
# 加载模型
model = models.word2vec.Word2Vec.load('XAJH.word2vec')
```

运行结果：

```
林平之 0.9181534051895142
岳灵珊 0.9176579713821411
岳不群 0.9009770750999451
盈盈 0.8934433460235596
岳夫人 0.8490750789642334
向问天 0.8287298083305359
林震南 0.8240236043930054
黑白子 0.8166840076446533
曲非烟 0.807110071182251
王夫人 0.8056358098983765
```
