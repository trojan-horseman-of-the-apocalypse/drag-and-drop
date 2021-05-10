import { Listener } from '../types/listener';
import { Project } from '../models/project';
import { ProjectStatus } from '../models/project-status';

export class State<T> {
  protected listeners: Listener<T>[] = []
  addListener (listenerFn: Listener<T>) {
    this.listeners.push(listenerFn)
  }
}

export class ProjectState extends State<Project>{
  private projects: Project[] = []
  private static instance: ProjectState;
  private constructor() {
    super();
  }
  static getInstance () {
    if (this.instance) {
      return this.instance
    }
    this.instance = new ProjectState()
    return this.instance
  }
  addProject (title: string, description: string, people: number) {
    const newProject = {
      id: Math.random().toString(),
      title,
      description,
      people,
      status: ProjectStatus.active
    };
    this.projects.push(newProject)

   this.updateListeners()
  }
  moveProject (projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find(project => project.id === projectId)
    if (project && project.status !== newStatus) {
      project.status = newStatus;
    }

    this.updateListeners()
  }
  private updateListeners () {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice())
    }
  }
}

export const projectState = ProjectState.getInstance();