import asyncio
from typing import Dict, Any, Callable
from datetime import datetime
import uuid

class BackgroundTaskManager:
    """Manages background tasks and job queues"""
    
    def __init__(self):
        self.tasks: Dict[str, Dict[str, Any]] = {}
        self.running_tasks: Dict[str, asyncio.Task] = {}
    
    async def submit_task(
        self, 
        task_func: Callable, 
        *args, 
        **kwargs
    ) -> str:
        """Submit a task to run in the background"""
        job_id = str(uuid.uuid4())
        
        # Create task entry
        self.tasks[job_id] = {
            "id": job_id,
            "status": "pending",
            "created_at": datetime.now().isoformat(),
            "args": args,
            "kwargs": kwargs,
            "result": None,
            "error": None
        }
        
        # Start the task
        task = asyncio.create_task(self._run_task(job_id, task_func, *args, **kwargs))
        self.running_tasks[job_id] = task
        
        return job_id
    
    async def _run_task(self, job_id: str, task_func: Callable, *args, **kwargs):
        """Run a background task"""
        try:
            self.tasks[job_id]["status"] = "running"
            self.tasks[job_id]["started_at"] = datetime.now().isoformat()
            
            # Run the actual task
            result = await task_func(*args, **kwargs)
            
            self.tasks[job_id]["status"] = "completed"
            self.tasks[job_id]["completed_at"] = datetime.now().isoformat()
            self.tasks[job_id]["result"] = result
            
        except Exception as e:
            self.tasks[job_id]["status"] = "failed"
            self.tasks[job_id]["failed_at"] = datetime.now().isoformat()
            self.tasks[job_id]["error"] = str(e)
        
        finally:
            # Clean up running task reference
            self.running_tasks.pop(job_id, None)
    
    def get_task_status(self, job_id: str) -> Dict[str, Any]:
        """Get the status of a background task"""
        return self.tasks.get(job_id, {"error": "Task not found"})
    
    def get_all_tasks(self) -> Dict[str, Dict[str, Any]]:
        """Get all tasks"""
        return self.tasks
    
    def cancel_task(self, job_id: str) -> bool:
        """Cancel a running task"""
        if job_id in self.running_tasks:
            self.running_tasks[job_id].cancel()
            self.tasks[job_id]["status"] = "cancelled"
            self.tasks[job_id]["cancelled_at"] = datetime.now().isoformat()
            return True
        return False

# Global task manager instance
task_manager = BackgroundTaskManager()
