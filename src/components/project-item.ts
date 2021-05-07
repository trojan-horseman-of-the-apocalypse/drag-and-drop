import { Component } from './base.js';
import { Draggable } from '../models/drag-drop.js';
import { Project } from '../models/project.js';
import { AutoBind } from '../decorators/autobind.js';

export class ProjectItem extends Component <HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project;
  get persons () {
    return this.project.people === 1 ? `${this.project.people.toString()} person` : `${this.project.people.toString()} people`
  }
  constructor(hostId: string, project: Project) {    
    super('single-project', hostId, false, project.id)
    this.project = project;
    this.configure()
    this.renderContent()
  }
  @AutoBind
  dragStartHandler (event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id)
    event.dataTransfer!.effectAllowed = 'move'
  }

  dragEndHandler (_: DragEvent) {
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler)
    this.element.addEventListener('dragend', this.dragEndHandler)
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = `${this.persons} assigned`;
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}