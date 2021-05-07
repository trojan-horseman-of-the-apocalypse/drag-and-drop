import { Component } from './base.js';
import { Validatable } from '../utils/validatable.js';
import { AutoBind } from '../decorators/autobind.js';
import { projectState } from '../state/project.js';

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
  titleInputElement: HTMLInputElement
  personInputElement: HTMLInputElement
  descriptionInputElement: HTMLInputElement
  
  constructor() {
    super('project-input', 'app', true, 'user-input') 
    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement
    this.personInputElement = this.element.querySelector('#people') as HTMLInputElement
    this.configure()
  }
  private clearInputs () {
    this.titleInputElement.value = ''
    this.descriptionInputElement.value = ''
    this.personInputElement.value = ''
  }
  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }
  renderContent () {}

  private validateInput(...args: Validatable[]): boolean {
    let isValid = true;
    for (let i = 0; i < args.length; i++) {
      const field = args[i]
      const { value, required, minLength, maxLength, min, max } = field;
      if (typeof value === 'string' && required) {
        if (minLength && minLength >= value.length) {
          isValid = false
        } else if (maxLength && value.length >= maxLength) {
          isValid = false
        }
      } else if (typeof value === 'number' && required) {
        if (min && value < min ) {
          isValid = false;
        } else if (max && value >= max) {
          isValid = false;
        } else if (value === 0) {
          isValid = false;
        }
      if (!isValid) break;
    }
  }
    return isValid;
  }
  private gatherUserInput (): [string, string, number] | void  {
    const enteredTitle = this.titleInputElement.value.trim()
    const enteredDescription = this.descriptionInputElement.value.trim()
    const enteredPerson = +this.personInputElement.value
    
    const isValidInput = this.validateInput({
      value: enteredTitle,
      required: true,
      minLength: 1,
      maxLength: 50
    }, {
      value: enteredDescription,
      required: true,
      minLength: 1,
      maxLength: 50
    }, {
      value: enteredPerson,
      required: true,
      min: 0,
      max: 10
    })
    if (isValidInput) return [enteredTitle, enteredDescription, enteredPerson]
    alert('incorrect input');
  }
  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput()
    if (Array.isArray(userInput)) {
      const [title, description, person] =  userInput
      projectState.addProject(title, description, person)
    }
    this.clearInputs()
  }
}