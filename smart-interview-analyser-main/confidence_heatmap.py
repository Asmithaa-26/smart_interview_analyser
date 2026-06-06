import numpy as np
import streamlit as st
import matplotlib.pyplot as plt

def render_confidence_heatmap(results):
    st.subheader("🔥 Confidence Heatmap")

    timeline = results["emotion_timeline"]

    emotion_map = {
        "happy": 3,
        "neutral": 2,
        "sad": 1,
        "angry": 1,
        "fear": 1
    }

    values = [emotion_map.get(e, 2) for e in timeline]
    heatmap = np.array(values).reshape(1, -1)

    fig3, ax3 = plt.subplots()
    ax3.imshow(heatmap, cmap="coolwarm", aspect="auto")
    ax3.set_yticks([])
    ax3.set_xlabel("Interview Timeline")

    st.pyplot(fig3)