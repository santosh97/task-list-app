from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

# Remove previous CORS configurations
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:4200"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        "allow_headers": ["Content-Type"]
    }
})

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:4200")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
        return response

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Task Model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    entityName = db.Column(db.String(100), nullable=False)
    taskType = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    taskTime = db.Column(db.DateTime, nullable=False)
    contactPerson = db.Column(db.String(100), nullable=False)
    note = db.Column(db.Text)
    status = db.Column(db.String(20), default='open')

    def to_dict(self):
        return {
            'id': self.id,
            'entityName': self.entityName,
            'taskType': self.taskType,
            'date': self.date.isoformat(),
            'taskTime': self.taskTime.isoformat(),
            'contactPerson': self.contactPerson,
            'note': self.note,
            'status': self.status
        }

# Routes
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    # Get filter parameters
    task_type = request.args.get('taskType')
    status = request.args.get('status')
    contact_person = request.args.get('contactPerson')
    entity_name = request.args.get('entityName')
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')

    # Start with base query
    query = Task.query

    # Apply filters
    if task_type:
        query = query.filter(Task.taskType == task_type)
    if status:
        query = query.filter(Task.status == status)
    if contact_person:
        query = query.filter(Task.contactPerson.ilike(f'%{contact_person}%'))
    if entity_name:
        query = query.filter(Task.entityName.ilike(f'%{entity_name}%'))
    if start_date:
        query = query.filter(Task.date >= datetime.fromisoformat(start_date))
    if end_date:
        query = query.filter(Task.date <= datetime.fromisoformat(end_date))

    tasks = query.all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/api/tasks', methods=['POST'])
def create_task():
    try:
        data = request.get_json()
        print("Received data:", data)  # Debug print
        
        task = Task(
            entityName=data['entityName'],
            taskType=data['taskType'],
            date=datetime.fromisoformat(data['date'].replace('Z', '+00:00')),
            taskTime=datetime.fromisoformat(data['taskTime'].replace('Z', '+00:00')),
            contactPerson=data['contactPerson'],
            note=data.get('note', ''),
            status='open'
        )
        db.session.add(task)
        db.session.commit()
        return jsonify(task.to_dict()), 201
    except Exception as e:
        print("Error:", str(e))  # Debug print
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/tasks/<int:task_id>', methods=['PATCH'])
def update_task_status(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.json
    try:
        task.status = data['status']
        db.session.commit()
        return jsonify(task.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    try:
        db.session.delete(task)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# Initialize database
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000) 