/** Class reimplementing the functionality of a Redux store. */
export class Store {
    // /**
    // * Create a point.
    // * @param {Object} reducers - Reducers to be used to manipulate state in the store. Empty object by default.
    // * @param {Object} initialState - The initial state of the store. Empty object by default.
    // */
    constructor(reducers = {}, initialState = {}) {
        this.subscribers = [];

        /**
        * The initial state of the Store
        * @name Component#state
        * @type Object
        * @default {}
        */
        // This will use the default case of reducer to build state tree
        this.state = this._reduce(initialState, {});
    }

    /**
    * Getter for the state object
    * @return {State} - state object of this Store
    */
    get value() {
        return this.state;
    }

    /**
    * Function used to present an instruction to update the state
    * @param {Object} action - the data to be used to manipulate the state of the Store
    * @param {string} action.type - type of the action, to be matched in the reducer
    * @param {Object} action.payload - data to be used to manipulate the state
    */
    dispatch(action) {
        this.state = this._reduce(this.state, action);
        
        // Notify subscribers of the change
        this.subscribers.forEach(
            fn => fn(this.value)
        );
    }

    /**
    * Function that allows passing a subscriber function into the Store
    * @param {Function} fn - callback to be called whenever store is updated
    */
    subscribe(fn) {
        this.subscribers = [...this.subscribers, fn];

        // Publish the current value on subscription
        fn(this.value);

        // Return an unsubscribe function
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== fn);
        };
    }

    /**
    * AKA RootReducer
    * Function used to calculate and return new state
    * @param {Object} state - state to be updated
    * @param {Object} action - the data to be used to manipulate the state of the Store
    * @return {Object} - updated state
    */
    _reduce(state, action) {
        return Object.entries(this.reducers)
            .reduce((newState, currentReducer) => {
                const [reducerName, reducerFn] = currentReducer;
                newState[reducerName] = reducerFn(state[reducerName], action);
                // ^ Register each reducer in the new store and update the store with result of each reducer
                return newState;
            }, {}); // Return a new (state) object
    }
}

const store = new Store();

// TODO: Add separate file with usage
// TODO: Update JSDoc