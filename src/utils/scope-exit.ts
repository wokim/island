import * as Promise from 'bluebird';

export interface DeferredTask {
  (): any;
}

export class ScopeExit {
  private tasksOnFulfilled: DeferredTask[] = [];
  private tasksOnRejected: DeferredTask[] = [];

  defer(task: DeferredTask): ScopeExit {
    return this.onFulfilled(task);
  }

  onFulfilled(task: DeferredTask): ScopeExit {
    this.tasksOnFulfilled.push(task);
    return this;
  }

  onRejected(task: DeferredTask): ScopeExit {
    this.tasksOnRejected.push(task);
    return this;
  }

  disposer(): Promise.Disposer<ScopeExit> {
    return Promise.resolve(this).disposer(async (result, promise) => {
      let tasks: DeferredTask[];
      if (promise.isFulfilled()) {
        tasks = this.tasksOnFulfilled;
      } else {
        tasks = this.tasksOnRejected;
      }
      for (let task of tasks) {
        await task();
      }
    });
  }
}
