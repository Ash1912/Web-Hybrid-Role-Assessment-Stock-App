from flask import Flask, jsonify, render_template
import pandas as pd
import os

app = Flask(__name__)

# Load data
file_path = "dump.csv"
df = pd.read_csv(file_path)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/companies')
def get_companies():
    companies = df['index_name'].unique().tolist()
    return jsonify(companies)

@app.route('/data/<company>')
def get_company_data(company):
    company_data = df[df['index_name'] == company][['index_date', 'closing_index_value']]
    company_data = company_data.sort_values('index_date')
    return jsonify(company_data.to_dict(orient='records'))

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)