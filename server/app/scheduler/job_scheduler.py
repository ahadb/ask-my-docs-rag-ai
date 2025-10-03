import asyncio
from typing import Dict, Any, Callable
from datetime import datetime, timedelta
import uuid

class JobScheduler:
    """Schedules recurring and delayed jobs"""
    
    def __init__(self):
        self.scheduled_jobs: Dict[str, Dict[str, Any]] = {}
        self.running_jobs: Dict[str, asyncio.Task] = {}
    
    async def schedule_job(
        self,
        job_func: Callable,
        delay_seconds: int = 0,
        interval_seconds: int = None,
        *args,
        **kwargs
    ) -> str:
        """Schedule a job to run after delay, optionally recurring"""
        job_id = str(uuid.uuid4())
        
        # Create job entry
        self.scheduled_jobs[job_id] = {
            "id": job_id,
            "status": "scheduled",
            "created_at": datetime.now().isoformat(),
            "delay_seconds": delay_seconds,
            "interval_seconds": interval_seconds,
            "next_run": datetime.now() + timedelta(seconds=delay_seconds),
            "args": args,
            "kwargs": kwargs,
            "runs": 0,
            "last_run": None,
            "last_result": None,
            "last_error": None
        }
        
        # Start the job
        task = asyncio.create_task(
            self._run_scheduled_job(job_id, job_func, delay_seconds, interval_seconds, *args, **kwargs)
        )
        self.running_jobs[job_id] = task
        
        return job_id
    
    async def _run_scheduled_job(
        self, 
        job_id: str, 
        job_func: Callable, 
        delay_seconds: int,
        interval_seconds: int,
        *args, 
        **kwargs
    ):
        """Run a scheduled job"""
        try:
            # Wait for initial delay
            if delay_seconds > 0:
                await asyncio.sleep(delay_seconds)
            
            # Run the job
            while True:
                try:
                    self.scheduled_jobs[job_id]["status"] = "running"
                    self.scheduled_jobs[job_id]["last_run"] = datetime.now().isoformat()
                    
                    # Run the actual job
                    result = await job_func(*args, **kwargs)
                    
                    self.scheduled_jobs[job_id]["runs"] += 1
                    self.scheduled_jobs[job_id]["last_result"] = result
                    self.scheduled_jobs[job_id]["status"] = "completed"
                    
                except Exception as e:
                    self.scheduled_jobs[job_id]["last_error"] = str(e)
                    self.scheduled_jobs[job_id]["status"] = "failed"
                
                # If no interval, run once and exit
                if interval_seconds is None:
                    break
                
                # Wait for next run
                await asyncio.sleep(interval_seconds)
                
        except asyncio.CancelledError:
            self.scheduled_jobs[job_id]["status"] = "cancelled"
            self.scheduled_jobs[job_id]["cancelled_at"] = datetime.now().isoformat()
        
        finally:
            # Clean up running job reference
            self.running_jobs.pop(job_id, None)
    
    def get_job_status(self, job_id: str) -> Dict[str, Any]:
        """Get the status of a scheduled job"""
        return self.scheduled_jobs.get(job_id, {"error": "Job not found"})
    
    def get_all_jobs(self) -> Dict[str, Dict[str, Any]]:
        """Get all scheduled jobs"""
        return self.scheduled_jobs
    
    def cancel_job(self, job_id: str) -> bool:
        """Cancel a scheduled job"""
        if job_id in self.running_jobs:
            self.running_jobs[job_id].cancel()
            self.scheduled_jobs[job_id]["status"] = "cancelled"
            self.scheduled_jobs[job_id]["cancelled_at"] = datetime.now().isoformat()
            return True
        return False

# Global job scheduler instance
job_scheduler = JobScheduler()
