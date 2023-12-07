import ChildComponent from '@/core/components/child.component';
import RenderService from '@/core/services/render.service';
import { $S } from '@/core/SQuery/SQuery';

import { UserService } from '@/api/user.service';

import { TRANSFER_FIELD_SELECTOR } from '@/components/screens/home/contacts/transfer-field/transfer-field.component';
import { UserItem } from '@/components/ui/user-item/user-item.component';

import { debounce } from '@/utils/debounce';
import { formatCardNumberWithDashes } from '@/utils/format/format-card-number';

import styles from './search.module.scss';
import template from './search.template.html';

export class Search extends ChildComponent {
  constructor() {
    super();

    this.userService = new UserService();
  }

  /**
   * Handle search
   * @param {Event} event - Event object
   * @returns {void}
   */
  #handleSearch = async event => {
    /**
     * Get the current search term
     */
    const searchTerm = event.target.value;
    /**
     * Get the search result element in which we will put the search results
     */
    const searchResultElement = $S(this.element).find('#search-results');

    if (!searchTerm) {
      searchResultElement.replace('');
      return;
    }

    await this.userService.getAllUsersBySearchTerm(searchTerm, users => {
      /**
       * Clear the search result element for new search result
       */
      searchResultElement.replace('');

      /**
       * Process each received user and add it in the search result element
       */
      users.forEach((user, index) => {
        const userItem = new UserItem(user, true, () => {
          $S(TRANSFER_FIELD_SELECTOR).setValue(
            formatCardNumberWithDashes(user.card.number)
          );

          searchResultElement.replace('');
        }).render();

        $S(userItem)
          .addClass(styles.item)
          .setStyle('transition-delay', `${index * 0.1}s`);

        searchResultElement.append(userItem);

        setTimeout(() => {
          $S(userItem).addClass(styles.visible);
        }, 50);
      });
    });
  };

  render() {
    this.element = RenderService.htmlToElement(template, [], styles);

    const debouncedHandleSearch = debounce(this.#handleSearch, 300);

    $S(this.element)
      .find('input')
      .input({
        type: 'search',
        name: 'search',
        placeholder: 'Search contacts...'
      })
      .on('input', debouncedHandleSearch);

    return this.element;
  }
}
