/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/**
 * A registry here is just a wrapper around a Map. It has a register function that calls set,
 * but also emits an event for internal use.
 */
export class MapRegistry {
    constructor() {
        this.map = new Map();
        this.handlers = [];
    }
    subscribe(handler) {
        this.handlers.push(handler);
    }
    unsubscribe(handler) {
        this.handlers = this.handlers.filter((h) => h !== handler);
    }
    notifyHandlers(type, key, value) {
        this.handlers.forEach((h) => h({ type, key, value }));
    }
    get(key) {
        return this.map.get(key);
    }
    /**
     * This does *not* trigger a register event, so cells already present with this cell type will not switch automatically.
     * Use register instead.
     */
    set(key, value) {
        if (!Array.isArray(key)) {
            key = [key];
        }
        key.forEach((k) => this.map.set(k, value));
    }
    has(key) {
        return this.map.has(key);
    }
    keys() {
        return this.map.keys();
    }
    values() {
        return this.map.values();
    }
    register(key, value) {
        if (!Array.isArray(key)) {
            key = [key];
        }
        key.forEach((k) => {
            this.map.set(k, value);
            this.notifyHandlers("register", k, value);
        });
    }
    deregister(key) {
        if (!this.has(key))
            return false;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const v = this.get(key);
        this.map.delete(key);
        this.notifyHandlers("deregister", key, v);
    }
    /**
     * Get the underlying Map
     */
    getMap() {
        return this.map;
    }
}
//# sourceMappingURL=registry.js.map