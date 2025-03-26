# Welcome to Binance Order Book

The app is structured in 3 main parts:
* **BinanceOrderBookAppComponent:** The application's entry point.
* **PairSelector components:** Contains all the logic and views for selecting trading pairs.
* **OrderBook components:** Contains all the logic and views for displaying individual order books.

On top of that, there are:
* **TradingService:** Handles HTTP requests to the Binance API.
* **Shared:** Includes common types and interfaces used throughout the application.
* **Store:** Contains folders for `OrderBook` and `TradingPairs` using NgRx for state management.

While planning and developing the app, I focused on various aspects to ensure a high-quality user experience:
* Fulfilling all functional and non-functional requirements.
* Providing a good UX and a pleasant UI, following industry's best practices.
* Implementing unit tests for reliability.
* Ensuring the application is responsive.
* Optimizing bundle size and overall performance.

In particular, regarding bundle size and performance, the following adjustments were implemented:
* **Initial loading performance and filtering:**
    * Due to limitations in the Binance API (no direct filtering or pagination for the initial pairs list), I implemented client-side filtering in the `PairSelector`.
    * To improve initial load time, the application initially loads and displays only the first 20 trading pairs in the dropdown.
    * A "Load all pairs" button is provided for users who need the complete list, preventing the loading of a potentially large dataset upfront.
	* The user can search for a specific symbol by using the textbox.
* **Change detection:** I used ChangeDetectionStrategy.OnPush to reduce the number of change detection cycles, leading to significant performance improvement.
* **Dynamic component rendering:** OrderBook components are added and removed dynamically, to minimize memory usage and improve performance, especially as more order books are created.
	* Users can also collapse order books, which also helps to the overall performance and UX.
* **NgRx State management:** I used NgRx store to improve data consistency, centralize state, and improve operations over large data flows.
* **Proper Subscriptions and Signals management:** To use memory efficiently and prevent memory leaks, I made sure to manage the lifecycle of subscription appropriately.
* **Real-time updates with Websockets:** I assured efficient and low-latency data fetching using Websockets to guarantee real-time data.

**Note:** The search filtering function of the pair selector dropdown could be further improved by utilizing an Observable stream and appropriate RxJS operators:
* For example:
	* `BehaviourSubject`: to have a default value (an empty string ' '), hold the most recent search term, and immediately emit the value when a new subscription is made.
	* `debounceTime`: to prevent excessive filtering while the user is typing.
	* `distinctUntilChanged`: to avoid redundant searches if the input hasn't changed.
	* `takeUntil`: to properly manage the subscription lifecycle and prevent potential memory leaks when the component is destroyed.
	* `switchMap`: to handle new search inputs and cancel any pending search operations.
	* `catchError`: to handle any errors that might occur during the stream without interrupting it.
* **Due to time constraints**, I was unable to integrate these performance improvements into the application. However, I would be happy to walk you through how I would implement them if you are interested.

## Project information

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
