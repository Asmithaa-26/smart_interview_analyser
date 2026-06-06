from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

def topic_relevance(user_answer, topic):

    emb1 = model.encode(user_answer, convert_to_tensor=True)
    emb2 = model.encode(topic, convert_to_tensor=True)

    score = util.pytorch_cos_sim(emb1, emb2)

    return round(float(score[0][0]) * 100, 2)