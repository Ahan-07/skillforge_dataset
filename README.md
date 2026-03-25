# skillforge_dataset
A static  dataset to provide structured learning content 
This project uses a hybrid knowledge system combining a static dataset and a RAG-based knowledge base.

Static Dataset

Located in backend/src/data/
Includes dataset.json, roadmap files, and prerequisite modules
Contains structured learning paths, topic hierarchies, prerequisites, and test questions
Used as a fallback system when the AI model is unavailable
Ensures consistent and offline-capable functionality

Knowledge Base (RAG)

Implemented in backend/src/services/ragKnowledge.js
Stores curated and verified learning resources (articles, videos, courses)
Covers domains like JavaScript, React, Python, DSA, Node.js, SQL, CSS, Git, and ML

Embeddings & Retrieval

Embeddings generated via Ollama (nomic-embed-text)
Enables semantic search for relevant content retrieval
Used in AI-powered routes for context-aware responses

Why this approach?
This hybrid design ensures high reliability (static dataset) and intelligent recommendations (RAG + embeddings), improving both system robustness and learning quality.
