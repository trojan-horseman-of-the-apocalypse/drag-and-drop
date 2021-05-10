import { Component } from './base';
import { DragTarget } from '../models/drag-drop';
import { Project } from '../models/project';
import { AutoBind } from '../decorators/autobind';
import { projectState } from '../state/project';
import { ProjectStatus } from '../models/project-status';
import { ProjectItem } from './project-item';

export class ProjectList extends Component<HTMLDivElement, HTMLElement> 
implements DragTarget {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`)
    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }
  @AutoBind
  dragOverHandler (event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEL = this.element.querySelector('ul')!;
      listEL.classList.add('droppable')
    }
  }

  @AutoBind
  dragLeaveHandler (_: DragEvent) {
    const listEL = this.element.querySelector('ul')!;
    listEL.classList.remove('droppable')
  }

  @AutoBind
  dropHandler (event: DragEvent) {
    const projectId = event.dataTransfer!.getData('text/plain')
    projectState.moveProject(projectId, this.type === 'active' ? ProjectStatus.active : ProjectStatus.finished)
  
  }

  renderContent () {
    const listId = `${this.type}-projects-list`
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = `${this.type.toString().toUpperCase()} PROJECTS`
  }

  configure () {
    this.element.addEventListener('dragover', this.dragOverHandler)
    this.element.addEventListener('dragleave', this.dragLeaveHandler)
    this.element.addEventListener('drop', this.dropHandler)
    projectState.addListener((projects: Project[]) => {      
      const relevantProjects = projects.filter(project => this.type === 'active' ? project.status === ProjectStatus.active : project.status === ProjectStatus.finished)      
      this.assignedProjects = relevantProjects
      this.renderProjects()
    })
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`)!
    listEl.innerHTML = ''
    for (const projectList of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, projectList)
    }
  }
}