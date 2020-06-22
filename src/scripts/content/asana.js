'use strict';

// Board view. Inserts button next to assignee/due date.
togglbutton.render('.BoardCard .BoardCard-contents:not(.toggl)', { observe: true },
  boadCardElem => {
    const descriptionSelector = () => boadCardElem.querySelector('.BoardCard-name').textContent.trim();

    const projectSelector = () => {
      const projectElement = document.querySelector('.TopbarPageHeaderStructure-titleRow > h1');
      if (!projectElement) return '';

      return projectElement.textContent.trim();
    };

    const link = togglbutton.createTimerLink({
      className: 'asana-board-view',
      description: descriptionSelector,
      projectName: projectSelector,
      buttonType: 'minimal'
      // N.B. tags cannot be supported on board view as the information is not available.
    });

    const injectContainer = boadCardElem.querySelector('.BoardCard-rightMetadata');
    if (injectContainer) {
      injectContainer.insertAdjacentElement('afterbegin', link);
    }
  }
);

// Spreadsheet view. Inserts button next to to the task name.
togglbutton.render('.SpreadsheetRow .SpreadsheetTaskName:not(.toggl)', { observe: true },
  function (taskNameCell) {
    const container = taskNameCell.closest('.SpreadsheetRow');

    if (container.querySelector('.toggl-button')) {
      // Due to the way this UI is rendered, we must check for existence of old buttons manually.
      return;
    }

    const descriptionSelector = () => taskNameCell.querySelector('textarea').textContent.trim();
    const projectHeaderSelector = () => {
      // Try to look for for page project title instead.
      const projectHeader = document.querySelector('.TopbarPageHeaderStructure.ProjectPageHeader .TopbarPageHeaderStructure-title');
      if (!projectHeader) {
        return '';
      }
      return projectHeader.textContent
        .replace(/\u00a0/g, ' ') // There can be &nbsp; in Asana header content
        .trim();
    };
    const projectSelector = () => {
      const projectCell = container.querySelector('.SpreadsheetTaskRow-projectsCell');
      if (!projectCell) {
        // Try to look for for page project title instead.
        return projectHeaderSelector();
      }

      // There can be multiple projects, but we can't support trying to match multiple yet.
      const firstProject = projectCell.querySelector('.Pill');
      return firstProject ? firstProject.textContent.trim() : projectHeaderSelector();
    };

    const tagsSelector = () => {
      const tags = container.querySelectorAll('.SpreadsheetTaskRow-tagsCell .Pill');
      return [...tags].map(tag => tag.textContent.trim());
    };

    const link = togglbutton.createTimerLink({
      className: 'asana-spreadsheet',
      description: descriptionSelector,
      projectName: projectSelector,
      tags: tagsSelector,
      buttonType: 'minimal'
    });

    taskNameCell.insertAdjacentElement('afterend', link);
  }
);

// My Tasks view.
togglbutton.render('.MyTasksTaskRow:not(.toggl)', { observe: true },
  function (elem) {
    if (elem.querySelector('.toggl-button')) {
      // Due to the way this UI is rendered, we must check for existence of old buttons manually.
      return;
    }
    const container = elem.querySelector('.ItemRowTwoColumnStructure-left');
    const descriptionSelector = () => elem.querySelector('.TaskName textarea').textContent;

    const projectSelector = () => {
      const projectElement = elem.querySelector('.TaskRow-pots [href$="board"]');

      return projectElement ? projectElement.textContent : '';
    };

    const tagsSelector = () => {
      const tags = elem.querySelectorAll('.Pill');
      // Try to exclude links to boards or projects that are also shown as "tags" here.
      const filteredTags = [...tags].filter(el => !el.closest('[href$="board"]'));
      return filteredTags.map(tag => tag.textContent.trim());
    };

    const link = togglbutton.createTimerLink({
      className: 'asana-new-ui',
      description: descriptionSelector,
      projectName: projectSelector,
      tags: tagsSelector,
      buttonType: 'minimal'
    });

    container.appendChild(link);
  }
);

// Task detail. My Tasks, Spreadsheet, Board, ...
togglbutton.render(
  '.SingleTaskPaneSpreadsheet:not(.toggl)',
  { observe: true },
  function (elem) {
    if ($('.toggl-button', elem)) {
      return;
    }

    const descriptionSelector = () => {
      return $('.SingleTaskTitleInput-taskName textarea', elem).textContent.trim();
    };

    const projectSelector = () => {
      const projectEl = $('.TaskProjectToken-potTokenizerPill', elem);
      return projectEl ? projectEl.textContent.trim() : '';
    };

    const tagsSelector = () => {
      const tags = elem.querySelectorAll('.TaskTagTokenPills .Pill');
      return [...tags].map(tag => tag.textContent.trim());
    };

    const link = togglbutton.createTimerLink({
      className: 'asana-board',
      description: descriptionSelector,
      projectName: projectSelector,
      tags: tagsSelector,
      buttonType: 'minimal'
    });

    link.style.margin = '0 5px';

    const firstButton = elem.querySelector('.SingleTaskPaneToolbar-button');
    firstButton.parentNode.insertBefore(link, firstButton);
  }
);

// Old and Beta UI - detail view
togglbutton.render(
  '.SingleTaskPane-titleRow:not(.toggl)',
  { observe: true },
  function (elem) {
    if ($('.toggl-button', elem)) {
      return;
    }
    const container = $('.SingleTaskPaneToolbar');

    const descriptionSelector = () => {
      return $(
        '.SingleTaskPane-titleRow .simpleTextarea',
        elem.parentNode
      ).textContent;
    };

    const projectSelector = () => {
      const projectElement = $(
        '.SingleTaskPane-projects .TaskProjectPill-projectName',
        elem.parentNode
      );

      return projectElement ? projectElement.textContent : '';
    };

    const link = togglbutton.createTimerLink({
      className: 'asana-board',
      description: descriptionSelector,
      projectName: projectSelector,
      buttonType: 'minimal'
    });

    link.style.marginRight = '5px';

    if (container) {
      const closeButton = container.lastElementChild;
      container.insertBefore(link, closeButton);
    }
  }
);
