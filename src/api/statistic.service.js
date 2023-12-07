import { MyQuery } from '@/core/my-query/my-query.lib';

export class StatisticService {
  #BASE_URL = '/statistics';

  main(onSuccess) {
    return MyQuery({
      path: `${this.#BASE_URL}`,
      onSuccess
    });
  }
}
