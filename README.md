# ML-Powered Student Mental Health Score Predictor

## 1. Project Overview

This project predicts a student's **Mental Health Score** as a continuous value using information about social media usage, study habits, sleep, physical activity, stress, demographics, and academic background. It is a regression problem built on a dataset of **5,000 students and 13 columns**.

The goal is to turn the trained ML model into a usable web application: users provide student information through a simple form, the FastAPI backend validates the input with Pydantic, and the trained model returns a predicted mental health score. The project execution plan follows the flow **Data → Model → FastAPI + Pydantic → UI → Deployment**.

> **Note:** This application is a prediction/ML demonstration, not a medical diagnostic or clinical assessment tool.

---

## 2. Features

* **Mental health score prediction** - enter student lifestyle, social media, demographic, and stress information to receive a predicted score.
* **Structured input validation** - invalid values are rejected before reaching the ML model through Pydantic validation.
* **Regression-based prediction** - predicts a continuous Mental Health Score rather than assigning a mental-health category.
* **Preprocessed raw inputs** - the saved ML pipeline handles transformations, scaling, and categorical encoding automatically.
* **API access** - predictions are exposed through a documented FastAPI `/predict` endpoint.
* **Health check endpoint** - `/health` provides a simple way to verify that the service is running.
* **Interactive web interface** - a lightweight HTML/CSS/JavaScript frontend allows users to interact with the model without needing to call the API manually.

---

## 3. Tech Stack

### Machine Learning

* **Python**
* **Pandas** - data loading and manipulation
* **NumPy** - numerical operations
* **Matplotlib / Seaborn** - exploratory data analysis and visualization
* **Scikit-learn** - preprocessing, regression models, evaluation, and hyperparameter tuning
* **Joblib** - saving the trained ML pipeline

The notebook uses Linear Regression as a baseline and Random Forest Regression as the stronger tree-based model.

### Backend

* **FastAPI** - HTTP API and application layer
* **Pydantic** - request and response validation

### Frontend

* **HTML**
* **CSS**
* **Vanilla JavaScript**
* Browser `fetch()` API

No frontend framework is required.

### Deployment

* **GitHub** - source repository
* **Render** - web-service deployment

---

## 4. Architecture

The application is built as a simple end-to-end inference pipeline:
<img width="1024" height="1536" alt="image" src="https://github.com/user-attachments/assets/2dc369c1-95c4-4927-ba3a-b75d6fb8c56b" style="width: 50%; height: auto/>


The key architectural decision is that the **preprocessing and trained model are stored together**. This allows the backend to pass raw validated input directly to the saved pipeline instead of manually reproducing the transformations used during training.

The frontend and API are also served from the same FastAPI application, giving the application a same-origin setup and avoiding the need for CORS configuration.

---

## 5. Project Structure

A clean repository layout for the application is:

```text
.
├── ML_Prediction_Notebook.ipynb
├── Mental_Health_Model.pkl
├── app/
│   ├── main.py
│   └── schemas.py
├── static/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── requirements.txt
└── README.md
```

### Main components

**`ML_Prediction_Notebook.ipynb`**

Contains the complete ML workflow:

* data inspection
* EDA
* dara cleaning
* feature engineering
* preprocessing
* model comparison
* hyperparameter tuning
* evaluation
* model persistence

The uploaded notebook is the source of the project's training workflow.

**`Mental_Health_Model.pkl`**

Contains the persisted Random Forest pipeline used for inference. The notebook saves the complete pipeline with Joblib rather than saving only the estimator.

**`app/`**

Contains the FastAPI application and Pydantic schemas.

**`static/`**

Contains the lightweight browser UI.

**`requirements.txt`**

Defines the Python dependencies required to run the application.

---

## 6. Demo Video

**Demo video:** *Add your video link here.*

The recommended demo flow is:

1. Open the deployed application.
2. Enter a valid student's information.
3. Submit the form.
4. Show the predicted Mental Health Score.
5. Submit an invalid value, such as a negative age.
6. Show the resulting FastAPI/Pydantic validation error.
7. Briefly show the API documentation and `/health` endpoint.

The project plan specifically identifies the invalid-input/422 response as an important demonstration of Pydantic's role in protecting the model from bad requests.

---

## 7. Engineering Decisions

### ML pipeline instead of a standalone model

The project uses a scikit-learn `Pipeline` and `ColumnTransformer` so preprocessing and prediction remain part of the same inference object.

The model receives raw features and the pipeline applies the required transformations before prediction. This avoids duplicating preprocessing logic inside FastAPI.

### Different encoding strategies for different categorical variables

`Stress_Level` is treated as an ordered variable:

```text
Low < Medium < High < Very High
```

while variables such as gender, academic level, platform, purpose of use, and grouped country are treated as nominal categories.

This avoids introducing an artificial ordering where one does not exist.

### High-cardinality country feature

The dataset contains many countries. Instead of one-hot encoding every country independently, the project keeps the **top 10 countries** and groups the remaining countries into `"Other"`.

This preserves some geographic signal while avoiding a large sparse feature space.

### Log transformation for Study Hours

`Study_Hours` was identified as the skewed numerical feature and receives a `log1p` transformation before scaling.

The other numerical features are scaled without the same logarithmic transformation.

### Model comparison

The project compares:

* Linear Regression
* Random Forest Regression
* Tuned Random Forest Regression

The purpose is not simply to use a more complex model, but to establish a baseline and then determine whether a nonlinear model provides better predictive performance.

### Model evaluation

The models are compared using:

* **R²** — variance explained by the model;
* **MAE** — average absolute prediction error in score units;
* **RMSE** — error metric that penalizes larger mistakes more heavily.

The recorded test results were:

| Model               |    Test R² |        MAE |       RMSE |
| ------------------- | ---------: | ---------: | ---------: |
| Linear Regression   |     0.7398 |     0.5362 |     0.6760 |
| Random Forest       | **0.8780** | **0.3465** | **0.4629** |
| Tuned Random Forest |     0.8652 |     0.3687 |     0.4865 |

The results show that the default Random Forest performed best on the held-out test set among the three evaluated models.

An important implementation detail is that the notebook ultimately saves **`rf_pipeline`**, the default Random Forest pipeline, as `Mental_Health_Model.pkl`, rather than the separately created `rf_best_pipeline` from the randomized search.

### Pydantic at the API boundary

Pydantic is used as the contract between external HTTP input and the ML pipeline.

The API validates:

```text
Request
   ↓
Pydantic
   ↓
Valid data
   ↓
ML pipeline
```

rather than allowing arbitrary request dictionaries to reach the model. The execution plan specifies typed request fields, validation constraints, a response schema, and integration with `/predict`.

### FastAPI as a thin service layer

FastAPI is intentionally kept separate from ML logic.

Its responsibilities are primarily:

* receiving HTTP requests;
* validating them;
* loading/reusing the saved model;
* calling prediction;
* returning the response;
* exposing `/health`.

The model itself remains responsible for preprocessing and prediction.

---

## 9. Limitations and Future Improvements

### Limitations

**Not a clinical assessment**

The model predicts a numerical score from patterns in the dataset. It should not be interpreted as a medical diagnosis, psychological assessment, or substitute for professional support.

**Dataset limitations**

The model is trained on a Kaggle dataset containing 5,000 student records. Its performance therefore reflects the characteristics of that dataset and may not generalize to different populations, age groups, countries, or real-world clinical settings.

**Correlation is not causation**

The model learns statistical relationships between the available features and the target. A relationship between social-media usage, stress, sleep, or another feature and the predicted score should not be interpreted as proof that one variable causes changes in mental health.

**Limited interpretability**

Although feature importance can provide useful insight into what the Random Forest learned, the model does not provide a causal explanation for an individual's predicted score.

**Model-selection workflow can be improved**

The notebook evaluates the tuned Random Forest on the same held-out test set used to compare the other models. A stronger production workflow would keep the final test set untouched until the very end and use cross-validation or a separate validation set for model selection.

**Persisted model should be explicitly tied to the selected experiment**

The notebook performs hyperparameter tuning and creates `rf_best_pipeline`, but the artifact that is actually saved is `rf_pipeline`, the default Random Forest. The default model happened to have the stronger recorded test metrics, but the selection should be made explicitly and documented as part of the final training workflow.

### Future Improvements

* Add a dedicated validation set or nested cross-validation for more rigorous model selection.
* Re-run tuning with a larger and more carefully defined hyperparameter search space.
* Compare additional regression models such as Gradient Boosting or HistGradientBoosting.
* Add stronger model interpretability, such as permutation importance or SHAP-based analysis.
* Add automated unit and API tests to the repository.
* Add stricter Pydantic constraints based on the real domain ranges of every feature.
* Add model/version metadata so the API can report exactly which model artifact is running.
* Monitor prediction behavior and data drift after deployment.
* Evaluate the model on data from different student populations to test generalization.
* Improve the frontend with clearer explanations of what the prediction means and, importantly, what it does **not** mean.
* Add a more production-oriented deployment setup if the application moves beyond demonstration use.
