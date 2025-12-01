{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": 2,
   "id": "3117ac6d-a47b-4471-aafc-ff4b7ab35ad6",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Collecting scikit-learn==1.6.1\n",
      "  Downloading scikit_learn-1.6.1-cp311-cp311-win_amd64.whl.metadata (15 kB)\n",
      "Requirement already satisfied: numpy>=1.19.5 in c:\\users\\rbray\\anaconda3\\lib\\site-packages (from scikit-learn==1.6.1) (1.26.4)\n",
      "Requirement already satisfied: scipy>=1.6.0 in c:\\users\\rbray\\anaconda3\\lib\\site-packages (from scikit-learn==1.6.1) (1.11.4)\n",
      "Requirement already satisfied: joblib>=1.2.0 in c:\\users\\rbray\\anaconda3\\lib\\site-packages (from scikit-learn==1.6.1) (1.2.0)\n",
      "Collecting threadpoolctl>=3.1.0 (from scikit-learn==1.6.1)\n",
      "  Using cached threadpoolctl-3.6.0-py3-none-any.whl.metadata (13 kB)\n",
      "Downloading scikit_learn-1.6.1-cp311-cp311-win_amd64.whl (11.1 MB)\n",
      "   ---------------------------------------- 0.0/11.1 MB ? eta -:--:--\n",
      "   ---------------------------------------- 0.0/11.1 MB ? eta -:--:--\n",
      "    --------------------------------------- 0.2/11.1 MB 2.4 MB/s eta 0:00:05\n",
      "   - -------------------------------------- 0.5/11.1 MB 3.9 MB/s eta 0:00:03\n",
      "   -- ------------------------------------- 0.8/11.1 MB 4.8 MB/s eta 0:00:03\n",
      "   ---- ----------------------------------- 1.1/11.1 MB 5.2 MB/s eta 0:00:02\n",
      "   ----- ---------------------------------- 1.5/11.1 MB 5.4 MB/s eta 0:00:02\n",
      "   ------ --------------------------------- 1.7/11.1 MB 5.5 MB/s eta 0:00:02\n",
      "   ------- -------------------------------- 2.1/11.1 MB 5.7 MB/s eta 0:00:02\n",
      "   -------- ------------------------------- 2.4/11.1 MB 5.9 MB/s eta 0:00:02\n",
      "   --------- ------------------------------ 2.7/11.1 MB 5.9 MB/s eta 0:00:02\n",
      "   ---------- ----------------------------- 3.0/11.1 MB 6.0 MB/s eta 0:00:02\n",
      "   ----------- ---------------------------- 3.3/11.1 MB 6.0 MB/s eta 0:00:02\n",
      "   ------------ --------------------------- 3.6/11.1 MB 6.1 MB/s eta 0:00:02\n",
      "   -------------- ------------------------- 3.9/11.1 MB 6.1 MB/s eta 0:00:02\n",
      "   --------------- ------------------------ 4.2/11.1 MB 6.2 MB/s eta 0:00:02\n",
      "   ---------------- ----------------------- 4.5/11.1 MB 6.2 MB/s eta 0:00:02\n",
      "   ----------------- ---------------------- 4.8/11.1 MB 6.2 MB/s eta 0:00:02\n",
      "   ------------------ --------------------- 5.2/11.1 MB 6.2 MB/s eta 0:00:01\n",
      "   ------------------ --------------------- 5.3/11.1 MB 6.0 MB/s eta 0:00:01\n",
      "   -------------------- ------------------- 5.6/11.1 MB 6.1 MB/s eta 0:00:01\n",
      "   --------------------- ------------------ 5.9/11.1 MB 6.2 MB/s eta 0:00:01\n",
      "   ---------------------- ----------------- 6.3/11.1 MB 6.2 MB/s eta 0:00:01\n",
      "   ----------------------- ---------------- 6.6/11.1 MB 6.2 MB/s eta 0:00:01\n",
      "   ------------------------ --------------- 6.9/11.1 MB 6.3 MB/s eta 0:00:01\n",
      "   ------------------------- -------------- 7.2/11.1 MB 6.3 MB/s eta 0:00:01\n",
      "   -------------------------- ------------- 7.5/11.1 MB 6.2 MB/s eta 0:00:01\n",
      "   ---------------------------- ----------- 7.8/11.1 MB 6.3 MB/s eta 0:00:01\n",
      "   ----------------------------- ---------- 8.2/11.1 MB 6.3 MB/s eta 0:00:01\n",
      "   ------------------------------ --------- 8.4/11.1 MB 6.3 MB/s eta 0:00:01\n",
      "   ------------------------------- -------- 8.8/11.1 MB 6.3 MB/s eta 0:00:01\n",
      "   -------------------------------- ------- 8.9/11.1 MB 6.3 MB/s eta 0:00:01\n",
      "   --------------------------------- ------ 9.3/11.1 MB 6.3 MB/s eta 0:00:01\n",
      "   ---------------------------------- ----- 9.6/11.1 MB 6.3 MB/s eta 0:00:01\n",
      "   ----------------------------------- ---- 9.9/11.1 MB 6.3 MB/s eta 0:00:01\n",
      "   ------------------------------------ --- 10.2/11.1 MB 6.3 MB/s eta 0:00:01\n",
      "   ------------------------------------ --- 10.2/11.1 MB 6.3 MB/s eta 0:00:01\n",
      "   -------------------------------------- - 10.8/11.1 MB 6.4 MB/s eta 0:00:01\n",
      "   ---------------------------------------  11.0/11.1 MB 6.4 MB/s eta 0:00:01\n",
      "   ---------------------------------------  11.1/11.1 MB 6.4 MB/s eta 0:00:01\n",
      "   ---------------------------------------- 11.1/11.1 MB 6.3 MB/s eta 0:00:00\n",
      "Using cached threadpoolctl-3.6.0-py3-none-any.whl (18 kB)\n",
      "Installing collected packages: threadpoolctl, scikit-learn\n",
      "  Attempting uninstall: threadpoolctl\n",
      "    Found existing installation: threadpoolctl 2.2.0\n",
      "    Uninstalling threadpoolctl-2.2.0:\n",
      "      Successfully uninstalled threadpoolctl-2.2.0\n",
      "  Attempting uninstall: scikit-learn\n",
      "    Found existing installation: scikit-learn 1.2.2\n",
      "    Uninstalling scikit-learn-1.2.2:\n",
      "      Successfully uninstalled scikit-learn-1.2.2\n",
      "Successfully installed scikit-learn-1.6.1 threadpoolctl-3.6.0\n"
     ]
    }
   ],
   "source": [
    "!pip install scikit-learn==1.6.1 --upgrade"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 4,
   "id": "4733cdd9-e5d2-4de8-8727-1885eb5697d9",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Model trained and saved.\n"
     ]
    }
   ],
   "source": [
    "import pandas as pd\n",
    "import joblib\n",
    "from sklearn.ensemble import RandomForestRegressor\n",
    "from sklearn.preprocessing import OneHotEncoder\n",
    "from sklearn.pipeline import Pipeline\n",
    "from sklearn.compose import ColumnTransformer\n",
    "\n",
    "# Simulated data\n",
    "data = [\n",
    "    {\"age_group\": \"20-25\", \"trimester\": \"1\", \"heat_sensitive\": True, \"pollution_sensitive\": False, \"concern\": \"Heatwave\", \"relevance\": 70},\n",
    "    {\"age_group\": \"26–30\", \"trimester\": \"2\", \"heat_sensitive\": False, \"pollution_sensitive\": True, \"concern\": \"Air Pollution\", \"relevance\": 90},\n",
    "    {\"age_group\": \"30-35\", \"trimester\": \"3\", \"heat_sensitive\": True, \"pollution_sensitive\": False, \"concern\": \"Heatwave\", \"relevance\": 85},\n",
    "    {\"age_group\": \"25–29\", \"trimester\": \"2\", \"heat_sensitive\": True, \"pollution_sensitive\": False, \"concern\": \"Heatwave\", \"relevance\": 88},\n",
    "]\n",
    "\n",
    "df = pd.DataFrame(data)\n",
    "\n",
    "# Features and label\n",
    "X = df.drop(\"relevance\", axis=1)\n",
    "y = df[\"relevance\"]\n",
    "\n",
    "# Preprocessing\n",
    "categorical = [\"age_group\", \"trimester\", \"concern\"]\n",
    "boolean = [\"heat_sensitive\", \"pollution_sensitive\"]\n",
    "\n",
    "preprocessor = ColumnTransformer(transformers=[\n",
    "    ('cat', OneHotEncoder(handle_unknown='ignore'), categorical),\n",
    "    ('bool', 'passthrough', boolean)\n",
    "])\n",
    "\n",
    "model = Pipeline(steps=[\n",
    "    ('preprocessor', preprocessor),\n",
    "    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))\n",
    "])\n",
    "\n",
    "# Train and save\n",
    "model.fit(X, y)\n",
    "joblib.dump(model, \"relevance_model.pkl\")\n",
    "print(\"Model trained and saved.\")\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 5,
   "id": "7035eed9-0896-4cfd-8545-080523b96581",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "1.2.2\n"
     ]
    }
   ],
   "source": [
    "import sklearn\n",
    "print(sklearn.__version__)\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "18cc6906-0e70-4b41-b040-2c9a6c096888",
   "metadata": {},
   "outputs": [],
   "source": []
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3 (ipykernel)",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.11.7"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
