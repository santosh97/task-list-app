from app import app, db, Task
from datetime import datetime, timedelta

def init_db():
    with app.app_context():
        # Create tables
        db.create_all()

        # Add sample data if db is empty
        if Task.query.count() == 0:
            sample_tasks = [
                {
                    'entityName': 'Company A',
                    'taskType': 'Meeting',
                    'date': datetime.now(),
                    'taskTime': datetime.now() + timedelta(hours=1),
                    'contactPerson': 'John Doe',
                    'note': 'Initial meeting',
                    'status': 'open'
                },
                {
                    'entityName': 'Company B',
                    'taskType': 'Call',
                    'date': datetime.now() + timedelta(days=1),
                    'taskTime': datetime.now() + timedelta(days=1, hours=2),
                    'contactPerson': 'Jane Smith',
                    'note': 'Follow-up call',
                    'status': 'open'
                }
            ]

            for task_data in sample_tasks:
                task = Task(**task_data)
                db.session.add(task)
            
            db.session.commit()
            print("Sample data added successfully!")

if __name__ == '__main__':
    init_db() 