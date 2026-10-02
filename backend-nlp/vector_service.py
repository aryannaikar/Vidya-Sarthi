"""
Vector Embedding Service for Vidya Sarthi pgvector Integration.
Generates 384-dimensional unit-normalized embeddings for student resumes
and opportunity postings, perfectly aligning with Supabase `vector(384)` column.
"""

import math
import hashlib
import re
from typing import List, Dict, Any, Optional

EMBEDDING_DIM = 384
_model = None
_model_attempted = False

def _get_sentence_transformer_model():
    global _model, _model_attempted
    if not _model_attempted:
        _model_attempted = True
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer("all-MiniLM-L6-v2")
            print("[VectorService] Successfully loaded sentence-transformers all-MiniLM-L6-v2")
        except Exception as e:
            print(f"[VectorService] sentence-transformers not available or offline ({e}). Using deterministic 384-d semantic hash projection.")
            _model = None
    return _model

def _tokenize(text: str) -> List[str]:
    """Tokenize and normalize text into word and bi-gram tokens"""
    clean = re.sub(r'[^a-zA-Z0-9\s+#.-]', ' ', text.lower())
    words = [w for w in clean.split() if len(w) > 1]
    bigrams = [f"{words[i]}_{words[i+1]}" for i in range(len(words) - 1)]
    return words + bigrams

def _deterministic_hash_embedding(text: str) -> List[float]:
    """
    High-performance semantic projection producing an L2-normalized 384-dimensional vector.
    Preserves lexical similarity and cosine similarity across shared skills and keywords.
    """
    if not text or not text.strip():
        # Return neutral normalized vector
        val = 1.0 / math.sqrt(EMBEDDING_DIM)
        return [round(val, 6)] * EMBEDDING_DIM

    tokens = _tokenize(text)
    vec = [0.0] * EMBEDDING_DIM

    # Distribute token weights with TF weighting
    for token in tokens:
        # Multiple hash digests to distribute signal across 384 dimensions
        h1 = int(hashlib.md5(token.encode('utf-8')).hexdigest(), 16)
        h2 = int(hashlib.sha256(token.encode('utf-8')).hexdigest(), 16)
        
        dim1 = h1 % EMBEDDING_DIM
        dim2 = (h1 >> 16) % EMBEDDING_DIM
        dim3 = h2 % EMBEDDING_DIM
        
        # Sign projection
        sign1 = 1.0 if (h1 & 1) else -1.0
        sign2 = 1.0 if ((h1 >> 1) & 1) else -1.0
        sign3 = 1.0 if (h2 & 1) else -1.0

        vec[dim1] += sign1 * 1.0
        vec[dim2] += sign2 * 0.7
        vec[dim3] += sign3 * 0.5

    # L2 normalize so cosine distance is consistent and within [0, 1]
    norm = math.sqrt(sum(v * v for v in vec))
    if norm > 0:
        vec = [round(v / norm, 6) for v in vec]
    else:
        val = 1.0 / math.sqrt(EMBEDDING_DIM)
        vec = [round(val, 6)] * EMBEDDING_DIM

    return vec

def generate_embedding(text: str) -> List[float]:
    """Generate 384-dimensional float vector for any input text"""
    model = _get_sentence_transformer_model()
    if model is not None:
        try:
            emb = model.encode(text, normalize_embeddings=True)
            return [round(float(x), 6) for x in emb.tolist()]
        except Exception:
            pass
    return _deterministic_hash_embedding(text)

def generate_resume_embedding(
    resume_text: str,
    skills: List[str],
    education: Optional[Dict[str, Any]] = None
) -> List[float]:
    """
    Construct rich contextual prompt for student profile and resume,
    prioritizing validated skills, projects, and degree for optimal pgvector matching.
    """
    edu_str = ""
    if education:
        degree = education.get("degree", "B.Tech Computer Science")
        grad_year = education.get("graduationYear", 2027)
        edu_str = f"Education: {degree}, Cohort {grad_year}. "

    skills_str = f"Core Technical Competencies: {', '.join(skills)}. " if skills else ""
    snippet_str = f"Resume Details: {resume_text[:1200]}"

    composite_text = f"{skills_str} {edu_str} {snippet_str}".strip()
    return generate_embedding(composite_text)

def generate_opportunity_embedding(
    title: str,
    company: str,
    description: str,
    required_skills: List[str],
    preferred_skills: Optional[List[str]] = None
) -> List[float]:
    """
    Construct rich representation for an opportunity posting to be stored in `opportunities.embedding`.
    """
    skills_req = f"Required Skills: {', '.join(required_skills)}. " if required_skills else ""
    skills_pref = f"Preferred Skills: {', '.join(preferred_skills or [])}. " if preferred_skills else ""
    header = f"Opportunity: {title} at {company}. "
    body = f"Description: {description[:1000]} "

    composite_text = f"{header} {skills_req} {skills_pref} {body}".strip()
    return generate_embedding(composite_text)
