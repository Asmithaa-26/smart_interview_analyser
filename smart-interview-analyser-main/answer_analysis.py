from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')

def calculate_answer_similarity(user_answer, expected_answer):
    emb1 = model.encode(user_answer, convert_to_tensor=True)
    emb2 = model.encode(expected_answer, convert_to_tensor=True)

    score = util.pytorch_cos_sim(emb1, emb2)

    return round(float(score[0][0]) * 100, 2)