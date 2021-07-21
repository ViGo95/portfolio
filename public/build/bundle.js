
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }

    // Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM
    // at the end of hydration without touching the remaining nodes.
    let is_hydrating = false;
    function start_hydrating() {
        is_hydrating = true;
    }
    function end_hydrating() {
        is_hydrating = false;
    }
    function upper_bound(low, high, key, value) {
        // Return first index of value larger than input value in the range [low, high)
        while (low < high) {
            const mid = low + ((high - low) >> 1);
            if (key(mid) <= value) {
                low = mid + 1;
            }
            else {
                high = mid;
            }
        }
        return low;
    }
    function init_hydrate(target) {
        if (target.hydrate_init)
            return;
        target.hydrate_init = true;
        // We know that all children have claim_order values since the unclaimed have been detached
        const children = target.childNodes;
        /*
        * Reorder claimed children optimally.
        * We can reorder claimed children optimally by finding the longest subsequence of
        * nodes that are already claimed in order and only moving the rest. The longest
        * subsequence subsequence of nodes that are claimed in order can be found by
        * computing the longest increasing subsequence of .claim_order values.
        *
        * This algorithm is optimal in generating the least amount of reorder operations
        * possible.
        *
        * Proof:
        * We know that, given a set of reordering operations, the nodes that do not move
        * always form an increasing subsequence, since they do not move among each other
        * meaning that they must be already ordered among each other. Thus, the maximal
        * set of nodes that do not move form a longest increasing subsequence.
        */
        // Compute longest increasing subsequence
        // m: subsequence length j => index k of smallest value that ends an increasing subsequence of length j
        const m = new Int32Array(children.length + 1);
        // Predecessor indices + 1
        const p = new Int32Array(children.length);
        m[0] = -1;
        let longest = 0;
        for (let i = 0; i < children.length; i++) {
            const current = children[i].claim_order;
            // Find the largest subsequence length such that it ends in a value less than our current value
            // upper_bound returns first greater value, so we subtract one
            const seqLen = upper_bound(1, longest + 1, idx => children[m[idx]].claim_order, current) - 1;
            p[i] = m[seqLen] + 1;
            const newLen = seqLen + 1;
            // We can guarantee that current is the smallest value. Otherwise, we would have generated a longer sequence.
            m[newLen] = i;
            longest = Math.max(newLen, longest);
        }
        // The longest increasing subsequence of nodes (initially reversed)
        const lis = [];
        // The rest of the nodes, nodes that will be moved
        const toMove = [];
        let last = children.length - 1;
        for (let cur = m[longest] + 1; cur != 0; cur = p[cur - 1]) {
            lis.push(children[cur - 1]);
            for (; last >= cur; last--) {
                toMove.push(children[last]);
            }
            last--;
        }
        for (; last >= 0; last--) {
            toMove.push(children[last]);
        }
        lis.reverse();
        // We sort the nodes being moved to guarantee that their insertion order matches the claim order
        toMove.sort((a, b) => a.claim_order - b.claim_order);
        // Finally, we move the nodes
        for (let i = 0, j = 0; i < toMove.length; i++) {
            while (j < lis.length && toMove[i].claim_order >= lis[j].claim_order) {
                j++;
            }
            const anchor = j < lis.length ? lis[j] : null;
            target.insertBefore(toMove[i], anchor);
        }
    }
    function append(target, node) {
        if (is_hydrating) {
            init_hydrate(target);
            if ((target.actual_end_child === undefined) || ((target.actual_end_child !== null) && (target.actual_end_child.parentElement !== target))) {
                target.actual_end_child = target.firstChild;
            }
            if (node !== target.actual_end_child) {
                target.insertBefore(node, target.actual_end_child);
            }
            else {
                target.actual_end_child = node.nextSibling;
            }
        }
        else if (node.parentNode !== target) {
            target.appendChild(node);
        }
    }
    function insert(target, node, anchor) {
        if (is_hydrating && !anchor) {
            append(target, node);
        }
        else if (node.parentNode !== target || (anchor && node.nextSibling !== anchor)) {
            target.insertBefore(node, anchor || null);
        }
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                start_hydrating();
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            end_hydrating();
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.3' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    		path: basedir,
    		exports: {},
    		require: function (path, base) {
    			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    		}
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var merge_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.merge = void 0;
    /**
     * Merge two objects
     *
     * Replacement for Object.assign() that is not supported by IE, so it cannot be used in production yet.
     */
    function merge(item1, item2, item3) {
        const result = Object.create(null);
        const items = [item1, item2, item3];
        for (let i = 0; i < 3; i++) {
            const item = items[i];
            if (typeof item === 'object' && item) {
                for (const key in item) {
                    result[key] = item[key];
                }
            }
        }
        return result;
    }
    exports.merge = merge;

    });

    var customisations = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fullCustomisations = exports.defaults = void 0;

    /**
     * Default icon customisations values
     */
    exports.defaults = Object.freeze({
        // Display mode
        inline: false,
        // Dimensions
        width: null,
        height: null,
        // Alignment
        hAlign: 'center',
        vAlign: 'middle',
        slice: false,
        // Transformations
        hFlip: false,
        vFlip: false,
        rotate: 0,
    });
    /**
     * Convert IconifyIconCustomisations to FullIconCustomisations
     */
    function fullCustomisations(item) {
        return merge_1.merge(exports.defaults, item);
    }
    exports.fullCustomisations = fullCustomisations;

    });

    var shorthand = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.alignmentFromString = exports.flipFromString = void 0;
    const separator = /[\s,]+/;
    /**
     * Apply "flip" string to icon customisations
     */
    function flipFromString(custom, flip) {
        flip.split(separator).forEach((str) => {
            const value = str.trim();
            switch (value) {
                case 'horizontal':
                    custom.hFlip = true;
                    break;
                case 'vertical':
                    custom.vFlip = true;
                    break;
            }
        });
    }
    exports.flipFromString = flipFromString;
    /**
     * Apply "align" string to icon customisations
     */
    function alignmentFromString(custom, align) {
        align.split(separator).forEach((str) => {
            const value = str.trim();
            switch (value) {
                case 'left':
                case 'center':
                case 'right':
                    custom.hAlign = value;
                    break;
                case 'top':
                case 'middle':
                case 'bottom':
                    custom.vAlign = value;
                    break;
                case 'slice':
                case 'crop':
                    custom.slice = true;
                    break;
                case 'meet':
                    custom.slice = false;
            }
        });
    }
    exports.alignmentFromString = alignmentFromString;

    });

    var rotate = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.rotateFromString = void 0;
    /**
     * Get rotation value
     */
    function rotateFromString(value) {
        const units = value.replace(/^-?[0-9.]*/, '');
        function cleanup(value) {
            while (value < 0) {
                value += 4;
            }
            return value % 4;
        }
        if (units === '') {
            const num = parseInt(value);
            return isNaN(num) ? 0 : cleanup(num);
        }
        else if (units !== value) {
            let split = 0;
            switch (units) {
                case '%':
                    // 25% -> 1, 50% -> 2, ...
                    split = 25;
                    break;
                case 'deg':
                    // 90deg -> 1, 180deg -> 2, ...
                    split = 90;
            }
            if (split) {
                let num = parseFloat(value.slice(0, value.length - units.length));
                if (isNaN(num)) {
                    return 0;
                }
                num = num / split;
                return num % 1 === 0 ? cleanup(num) : 0;
            }
        }
        return 0;
    }
    exports.rotateFromString = rotateFromString;

    });

    var icon = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fullIcon = exports.iconDefaults = void 0;

    /**
     * Default values for IconifyIcon properties
     */
    exports.iconDefaults = Object.freeze({
        body: '',
        left: 0,
        top: 0,
        width: 16,
        height: 16,
        rotate: 0,
        vFlip: false,
        hFlip: false,
    });
    /**
     * Create new icon with all properties
     */
    function fullIcon(icon) {
        return merge_1.merge(exports.iconDefaults, icon);
    }
    exports.fullIcon = fullIcon;

    });

    var calcSize = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.calculateSize = void 0;
    /**
     * Regular expressions for calculating dimensions
     */
    const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
    const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
    /**
     * Calculate second dimension when only 1 dimension is set
     *
     * @param {string|number} size One dimension (such as width)
     * @param {number} ratio Width/height ratio.
     *      If size is width, ratio = height/width
     *      If size is height, ratio = width/height
     * @param {number} [precision] Floating number precision in result to minimize output. Default = 2
     * @return {string|number} Another dimension
     */
    function calculateSize(size, ratio, precision) {
        if (ratio === 1) {
            return size;
        }
        precision = precision === void 0 ? 100 : precision;
        if (typeof size === 'number') {
            return Math.ceil(size * ratio * precision) / precision;
        }
        if (typeof size !== 'string') {
            return size;
        }
        // Split code into sets of strings and numbers
        const oldParts = size.split(unitsSplit);
        if (oldParts === null || !oldParts.length) {
            return size;
        }
        const newParts = [];
        let code = oldParts.shift();
        let isNumber = unitsTest.test(code);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (isNumber) {
                const num = parseFloat(code);
                if (isNaN(num)) {
                    newParts.push(code);
                }
                else {
                    newParts.push(Math.ceil(num * ratio * precision) / precision);
                }
            }
            else {
                newParts.push(code);
            }
            // next
            code = oldParts.shift();
            if (code === void 0) {
                return newParts.join('');
            }
            isNumber = !isNumber;
        }
    }
    exports.calculateSize = calculateSize;

    });

    var builder = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.iconToSVG = void 0;

    /**
     * Get preserveAspectRatio value
     */
    function preserveAspectRatio(props) {
        let result = '';
        switch (props.hAlign) {
            case 'left':
                result += 'xMin';
                break;
            case 'right':
                result += 'xMax';
                break;
            default:
                result += 'xMid';
        }
        switch (props.vAlign) {
            case 'top':
                result += 'YMin';
                break;
            case 'bottom':
                result += 'YMax';
                break;
            default:
                result += 'YMid';
        }
        result += props.slice ? ' slice' : ' meet';
        return result;
    }
    /**
     * Get SVG attributes and content from icon + customisations
     *
     * Does not generate style to make it compatible with frameworks that use objects for style, such as React.
     * Instead, it generates verticalAlign value that should be added to style.
     *
     * Customisations should be normalised by platform specific parser.
     * Result should be converted to <svg> by platform specific parser.
     * Use replaceIDs to generate unique IDs for body.
     */
    function iconToSVG(icon, customisations) {
        // viewBox
        const box = {
            left: icon.left,
            top: icon.top,
            width: icon.width,
            height: icon.height,
        };
        // Apply transformations
        const transformations = [];
        const hFlip = customisations.hFlip !== icon.hFlip;
        const vFlip = customisations.vFlip !== icon.vFlip;
        let rotation = customisations.rotate + icon.rotate;
        if (hFlip) {
            if (vFlip) {
                rotation += 2;
            }
            else {
                // Horizontal flip
                transformations.push('translate(' +
                    (box.width + box.left) +
                    ' ' +
                    (0 - box.top) +
                    ')');
                transformations.push('scale(-1 1)');
                box.top = box.left = 0;
            }
        }
        else if (vFlip) {
            // Vertical flip
            transformations.push('translate(' + (0 - box.left) + ' ' + (box.height + box.top) + ')');
            transformations.push('scale(1 -1)');
            box.top = box.left = 0;
        }
        let tempValue;
        rotation = rotation % 4;
        switch (rotation) {
            case 1:
                // 90deg
                tempValue = box.height / 2 + box.top;
                transformations.unshift('rotate(90 ' + tempValue + ' ' + tempValue + ')');
                break;
            case 2:
                // 180deg
                transformations.unshift('rotate(180 ' +
                    (box.width / 2 + box.left) +
                    ' ' +
                    (box.height / 2 + box.top) +
                    ')');
                break;
            case 3:
                // 270deg
                tempValue = box.width / 2 + box.left;
                transformations.unshift('rotate(-90 ' + tempValue + ' ' + tempValue + ')');
                break;
        }
        if (rotation % 2 === 1) {
            // Swap width/height and x/y for 90deg or 270deg rotation
            if (box.left !== 0 || box.top !== 0) {
                tempValue = box.left;
                box.left = box.top;
                box.top = tempValue;
            }
            if (box.width !== box.height) {
                tempValue = box.width;
                box.width = box.height;
                box.height = tempValue;
            }
        }
        // Calculate dimensions
        let width, height;
        if (customisations.width === null && customisations.height === null) {
            // Set height to '1em', calculate width
            height = '1em';
            width = calcSize.calculateSize(height, box.width / box.height);
        }
        else if (customisations.width !== null &&
            customisations.height !== null) {
            // Values are set
            width = customisations.width;
            height = customisations.height;
        }
        else if (customisations.height !== null) {
            // Height is set
            height = customisations.height;
            width = calcSize.calculateSize(height, box.width / box.height);
        }
        else {
            // Width is set
            width = customisations.width;
            height = calcSize.calculateSize(width, box.height / box.width);
        }
        // Check for 'auto'
        if (width === 'auto') {
            width = box.width;
        }
        if (height === 'auto') {
            height = box.height;
        }
        // Convert to string
        width = typeof width === 'string' ? width : width + '';
        height = typeof height === 'string' ? height : height + '';
        // Generate body
        let body = icon.body;
        if (transformations.length) {
            body =
                '<g transform="' + transformations.join(' ') + '">' + body + '</g>';
        }
        // Result
        const result = {
            attributes: {
                width,
                height,
                preserveAspectRatio: preserveAspectRatio(customisations),
                viewBox: box.left + ' ' + box.top + ' ' + box.width + ' ' + box.height,
            },
            body,
        };
        if (customisations.inline) {
            result.inline = true;
        }
        return result;
    }
    exports.iconToSVG = iconToSVG;

    });

    var ids = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.replaceIDs = void 0;
    /**
     * Regular expression for finding ids
     */
    const regex = /\sid="(\S+)"/g;
    /**
     * New random-ish prefix for ids
     */
    const randomPrefix = 'IconifyId-' +
        Date.now().toString(16) +
        '-' +
        ((Math.random() * 0x1000000) | 0).toString(16) +
        '-';
    /**
     * Counter for ids, increasing with every replacement
     */
    let counter = 0;
    /**
     * Replace multiple occurance of same string
     */
    function strReplace(search, replace, subject) {
        let pos = 0;
        while ((pos = subject.indexOf(search, pos)) !== -1) {
            subject =
                subject.slice(0, pos) +
                    replace +
                    subject.slice(pos + search.length);
            pos += replace.length;
        }
        return subject;
    }
    /**
     * Replace IDs in SVG output with unique IDs
     * Fast replacement without parsing XML, assuming commonly used patterns and clean XML (icon should have been cleaned up with Iconify Tools or SVGO).
     */
    function replaceIDs(body, prefix = randomPrefix) {
        // Find all IDs
        const ids = [];
        let match;
        while ((match = regex.exec(body))) {
            ids.push(match[1]);
        }
        if (!ids.length) {
            return body;
        }
        // Replace with unique ids
        ids.forEach(id => {
            const newID = typeof prefix === 'function' ? prefix() : prefix + counter++;
            body = strReplace('="' + id + '"', '="' + newID + '"', body);
            body = strReplace('="#' + id + '"', '="#' + newID + '"', body);
            body = strReplace('(#' + id + ')', '(#' + newID + ')', body);
        });
        return body;
    }
    exports.replaceIDs = replaceIDs;

    });

    /**
     * Default SVG attributes
     */
    const svgDefaults = {
    	'xmlns': 'http://www.w3.org/2000/svg',
    	'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    	'aria-hidden': true,
    	'role': 'img',
    };

    /**
     * Generate icon from properties
     */
    function generateIcon(props) {
    	let iconData = icon.fullIcon(props.icon);
    	if (!iconData) {
    		return {
    			attributes: svgDefaults,
    			body: '',
    		};
    	}

    	const customisations$1 = merge_1.merge(customisations.defaults, props);
    	const componentProps = merge_1.merge(svgDefaults);

    	// Create style if missing
    	let style = typeof props.style === 'string' ? props.style : '';

    	// Get element properties
    	for (let key in props) {
    		const value = props[key];
    		switch (key) {
    			// Properties to ignore
    			case 'icon':
    			case 'style':
    				break;

    			// Flip as string: 'horizontal,vertical'
    			case 'flip':
    				shorthand.flipFromString(customisations$1, value);
    				break;

    			// Alignment as string
    			case 'align':
    				shorthand.alignmentFromString(customisations$1, value);
    				break;

    			// Color: copy to style
    			case 'color':
    				style = 'color: ' + value + '; ' + style;
    				break;

    			// Rotation as string
    			case 'rotate':
    				if (typeof value !== 'number') {
    					customisations$1[key] = rotate.rotateFromString(value);
    				} else {
    					componentProps[key] = value;
    				}
    				break;

    			// Remove aria-hidden
    			case 'ariaHidden':
    			case 'aria-hidden':
    				if (value !== true && value !== 'true') {
    					delete componentProps['aria-hidden'];
    				}
    				break;

    			// Copy missing property if it does not exist in customisations
    			default:
    				if (customisations.defaults[key] === void 0) {
    					componentProps[key] = value;
    				}
    		}
    	}

    	// Generate icon
    	const item = builder.iconToSVG(iconData, customisations$1);

    	// Add icon stuff
    	for (let key in item.attributes) {
    		componentProps[key] = item.attributes[key];
    	}

    	if (item.inline) {
    		style = 'vertical-align: -0.125em; ' + style;
    	}

    	// Style
    	if (style !== '') {
    		componentProps.style = style;
    	}

    	// Counter for ids based on "id" property to render icons consistently on server and client
    	let localCounter = 0;
    	const id = props.id;

    	// Generate HTML
    	return {
    		attributes: componentProps,
    		body: ids.replaceIDs(
    			item.body,
    			id ? () => id + '-' + localCounter++ : 'iconify-svelte-'
    		),
    	};
    }

    /* node_modules\@iconify\svelte\dist\Icon.svelte generated by Svelte v3.38.3 */
    const file$5 = "node_modules\\@iconify\\svelte\\dist\\Icon.svelte";

    function create_fragment$5(ctx) {
    	let svg;
    	let raw_value = /*data*/ ctx[0].body + "";
    	let svg_levels = [/*data*/ ctx[0].attributes];
    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$5, 11, 0, 142);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			svg.innerHTML = raw_value;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1 && raw_value !== (raw_value = /*data*/ ctx[0].body + "")) svg.innerHTML = raw_value;			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [dirty & /*data*/ 1 && /*data*/ ctx[0].attributes]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Icon", slots, []);
    	let data;

    	$$self.$$set = $$new_props => {
    		$$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ generateIcon, data });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(1, $$props = assign(assign({}, $$props), $$new_props));
    		if ("data" in $$props) $$invalidate(0, data = $$new_props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		{
    			$$invalidate(0, data = generateIcon($$props));
    		}
    	};

    	$$props = exclude_internal_props($$props);
    	return [data];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    var data$c = {
    	"body": "<g fill=\"none\"><path d=\"M2 5.995c0-.55.446-.995.995-.995h8.01a.995.995 0 0 1 0 1.99h-8.01A.995.995 0 0 1 2 5.995z\" fill=\"currentColor\"/><path d=\"M2 12c0-.55.446-.995.995-.995h18.01a.995.995 0 1 1 0 1.99H2.995A.995.995 0 0 1 2 12z\" fill=\"currentColor\"/><path d=\"M2.995 17.01a.995.995 0 0 0 0 1.99h12.01a.995.995 0 0 0 0-1.99H2.995z\" fill=\"currentColor\"/></g>",
    	"width": 24,
    	"height": 24
    };

    var _default$c = data$c;

    var data$b = {
    	"body": "<path d=\"M12 11.807A9.002 9.002 0 0 1 10.049 2a9.942 9.942 0 0 0-5.12 2.735c-3.905 3.905-3.905 10.237 0 14.142c3.906 3.906 10.237 3.905 14.143 0a9.946 9.946 0 0 0 2.735-5.119A9.003 9.003 0 0 1 12 11.807z\" fill=\"currentColor\"/>",
    	"width": 24,
    	"height": 24
    };

    var _default$b = data$b;

    /* src\Header.svelte generated by Svelte v3.38.3 */
    const file$4 = "src\\Header.svelte";

    function create_fragment$4(ctx) {
    	let header;
    	let icon0;
    	let t;
    	let icon1;
    	let current;

    	icon0 = new Icon({
    			props: {
    				icon: _default$c,
    				width: "34",
    				color: "#0097E6"
    			},
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: {
    				icon: _default$b,
    				width: "30",
    				color: "#5E687E"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			header = element("header");
    			create_component(icon0.$$.fragment);
    			t = space();
    			create_component(icon1.$$.fragment);
    			attr_dev(header, "class", "svelte-1284okf");
    			add_location(header, file$4, 8, 0, 174);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			mount_component(icon0, header, null);
    			append_dev(header, t);
    			mount_component(icon1, header, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(icon0);
    			destroy_component(icon1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Header", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Icon, menuLeft: _default$c, bxsMoon: _default$b });
    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    var data$a = {
    	"body": "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12.026 2c-5.509 0-9.974 4.465-9.974 9.974c0 4.406 2.857 8.145 6.821 9.465c.499.09.679-.217.679-.481c0-.237-.008-.865-.011-1.696c-2.775.602-3.361-1.338-3.361-1.338c-.452-1.152-1.107-1.459-1.107-1.459c-.905-.619.069-.605.069-.605c1.002.07 1.527 1.028 1.527 1.028c.89 1.524 2.336 1.084 2.902.829c.091-.645.351-1.085.635-1.334c-2.214-.251-4.542-1.107-4.542-4.93c0-1.087.389-1.979 1.024-2.675c-.101-.253-.446-1.268.099-2.64c0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336a9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021c.545 1.372.203 2.387.099 2.64c.64.696 1.024 1.587 1.024 2.675c0 3.833-2.33 4.675-4.552 4.922c.355.308.675.916.675 1.846c0 1.334-.012 2.41-.012 2.737c0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974C22 6.465 17.535 2 12.026 2z\" fill=\"currentColor\"/>",
    	"width": 24,
    	"height": 24
    };

    var _default$a = data$a;

    var data$9 = {
    	"body": "<circle cx=\"4.983\" cy=\"5.009\" r=\"2.188\" fill=\"currentColor\"/><path d=\"M9.237 8.855v12.139h3.769v-6.003c0-1.584.298-3.118 2.262-3.118c1.937 0 1.961 1.811 1.961 3.218v5.904H21v-6.657c0-3.27-.704-5.783-4.526-5.783c-1.835 0-3.065 1.007-3.568 1.96h-.051v-1.66H9.237zm-6.142 0H6.87v12.139H3.095z\" fill=\"currentColor\"/>",
    	"width": 24,
    	"height": 24
    };

    var _default$9 = data$9;

    var data$8 = {
    	"body": "<path d=\"M19.633 7.997c.013.175.013.349.013.523c0 5.325-4.053 11.461-11.46 11.461c-2.282 0-4.402-.661-6.186-1.809c.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721a4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062c.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973a4.02 4.02 0 0 1-1.771 2.22a8.073 8.073 0 0 0 2.319-.624a8.645 8.645 0 0 1-2.019 2.083z\" fill=\"currentColor\"/>",
    	"width": 24,
    	"height": 24
    };

    var _default$8 = data$8;

    var data$7 = {
    	"body": "<path d=\"M11.999 7.377a4.623 4.623 0 1 0 0 9.248a4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008a3.004 3.004 0 0 1 0 6.008z\" fill=\"currentColor\"/><circle cx=\"16.806\" cy=\"7.207\" r=\"1.078\" fill=\"currentColor\"/><path d=\"M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42a4.6 4.6 0 0 0-2.633 2.632a6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71c0 2.442 0 2.753.056 3.71c.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632a6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419a4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186c.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688a2.987 2.987 0 0 1-1.712 1.711a4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055c-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311a2.985 2.985 0 0 1-1.719-1.711a5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654c0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311a2.991 2.991 0 0 1 1.712 1.712a5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655c0 2.436 0 2.698-.043 3.654h-.011z\" fill=\"currentColor\"/>",
    	"width": 24,
    	"height": 24
    };

    var _default$7 = data$7;

    /* src\Hero.svelte generated by Svelte v3.38.3 */
    const file$3 = "src\\Hero.svelte";

    function create_fragment$3(ctx) {
    	let section;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let ul;
    	let li0;
    	let a0;
    	let icon0;
    	let t1;
    	let li1;
    	let a1;
    	let icon1;
    	let t2;
    	let li2;
    	let a2;
    	let icon2;
    	let t3;
    	let li3;
    	let a3;
    	let icon3;
    	let t4;
    	let div1;
    	let h2;
    	let t6;
    	let p0;
    	let t8;
    	let p1;
    	let t10;
    	let div2;
    	let a4;
    	let t12;
    	let button;
    	let current;

    	icon0 = new Icon({
    			props: {
    				icon: _default$a,
    				width: "22",
    				color: "#5E687E"
    			},
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: {
    				icon: _default$9,
    				width: "22",
    				color: "#5E687E"
    			},
    			$$inline: true
    		});

    	icon2 = new Icon({
    			props: {
    				icon: _default$8,
    				width: "22",
    				color: "#5E687E"
    			},
    			$$inline: true
    		});

    	icon3 = new Icon({
    			props: {
    				icon: _default$7,
    				width: "22",
    				color: "#5E687E"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			create_component(icon0.$$.fragment);
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			create_component(icon1.$$.fragment);
    			t2 = space();
    			li2 = element("li");
    			a2 = element("a");
    			create_component(icon2.$$.fragment);
    			t3 = space();
    			li3 = element("li");
    			a3 = element("a");
    			create_component(icon3.$$.fragment);
    			t4 = space();
    			div1 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Hi! ViGo here.";
    			t6 = space();
    			p0 = element("p");
    			p0.textContent = "Fullstack Developer & Network Admin";
    			t8 = space();
    			p1 = element("p");
    			p1.textContent = "Comence mi carrera como Administrador de redes en un buen Data Center. Hace poco encontre\r\n       el Desarrollo web y me apasione totalmente... Desde entonces me considero una combinacion de dos mundos.";
    			t10 = space();
    			div2 = element("div");
    			a4 = element("a");
    			a4.textContent = "Whatsapp me";
    			t12 = space();
    			button = element("button");
    			button.textContent = "Send a mail";
    			if (img.src !== (img_src_value = "images/photo.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Presentation");
    			add_location(img, file$3, 13, 4, 391);
    			attr_dev(a0, "target", "__blank");
    			attr_dev(a0, "href", "https://github.com/ViGo95");
    			add_location(a0, file$3, 15, 10, 460);
    			add_location(li0, file$3, 15, 6, 456);
    			attr_dev(a1, "target", "__blank");
    			attr_dev(a1, "href", "https://www.linkedin.com/in/luis-vi%C3%B1as/");
    			add_location(a1, file$3, 16, 10, 586);
    			add_location(li1, file$3, 16, 6, 582);
    			attr_dev(a2, "target", "__blank");
    			attr_dev(a2, "href", "https://twitter.com/vigo_dev");
    			add_location(a2, file$3, 17, 10, 733);
    			add_location(li2, file$3, 17, 6, 729);
    			attr_dev(a3, "target", "__blank");
    			attr_dev(a3, "href", "https://www.instagram.com/vigo.dev/");
    			add_location(a3, file$3, 18, 10, 863);
    			add_location(li3, file$3, 18, 6, 859);
    			attr_dev(ul, "class", "svelte-107758f");
    			add_location(ul, file$3, 14, 4, 444);
    			attr_dev(div0, "class", "photo-socials svelte-107758f");
    			add_location(div0, file$3, 12, 2, 358);
    			attr_dev(h2, "class", "hi-text svelte-107758f");
    			add_location(h2, file$3, 23, 4, 1073);
    			attr_dev(p0, "class", "tittle-text svelte-107758f");
    			add_location(p0, file$3, 24, 4, 1118);
    			attr_dev(p1, "class", "about-text svelte-107758f");
    			add_location(p1, file$3, 25, 4, 1186);
    			attr_dev(div1, "class", "about svelte-107758f");
    			add_location(div1, file$3, 22, 2, 1048);
    			attr_dev(a4, "class", "button ws-button svelte-107758f");
    			add_location(a4, file$3, 30, 4, 1487);
    			attr_dev(button, "class", "button mail-button svelte-107758f");
    			add_location(button, file$3, 31, 4, 1536);
    			attr_dev(div2, "class", "buttons svelte-107758f");
    			add_location(div2, file$3, 29, 2, 1460);
    			add_location(section, file$3, 10, 0, 296);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			mount_component(icon0, a0, null);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			mount_component(icon1, a1, null);
    			append_dev(ul, t2);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			mount_component(icon2, a2, null);
    			append_dev(ul, t3);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			mount_component(icon3, a3, null);
    			append_dev(section, t4);
    			append_dev(section, div1);
    			append_dev(div1, h2);
    			append_dev(div1, t6);
    			append_dev(div1, p0);
    			append_dev(div1, t8);
    			append_dev(div1, p1);
    			append_dev(section, t10);
    			append_dev(section, div2);
    			append_dev(div2, a4);
    			append_dev(div2, t12);
    			append_dev(div2, button);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(icon2.$$.fragment, local);
    			transition_in(icon3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(icon2.$$.fragment, local);
    			transition_out(icon3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(icon0);
    			destroy_component(icon1);
    			destroy_component(icon2);
    			destroy_component(icon3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Hero", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Hero> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Icon,
    		bxlGithub: _default$a,
    		bxlLinkedin: _default$9,
    		bxlTwitter: _default$8,
    		bxlInstagram: _default$7
    	});

    	return [];
    }

    class Hero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    var data$6 = {
    	"body": "<path d=\"M403.508 229.23C491.235 87.7 315.378-58.105 190.392 23.555L71.528 99.337c-57.559 37.487-82.55 109.513-47.45 183.53c-87.761 133.132 83.005 289.03 213.116 205.762l118.864-75.782c64.673-42.583 79.512-116.018 47.45-183.616zm-297.592-80.886l118.69-75.739c77.973-46.679 167.756 34.942 135.388 110.992c-19.225-15.274-40.65-24.665-56.923-28.894c6.186-24.57-22.335-42.796-42.174-30.106l-118.95 75.48c-29.411 20.328 1.946 62.138 31.014 44.596l45.33-28.895c101.725-57.403 198 80.425 103.38 147.975l-118.692 75.739C131.455 485.225 34.11 411.96 67.592 328.5c17.786 13.463 36.677 23.363 56.923 28.894c-4.47 28.222 24.006 41.943 42.476 30.365L285.64 312.02c29.28-21.955-2.149-61.692-30.97-44.595l-45.504 28.894c-100.56 58.77-199.076-80.42-103.25-147.975z\" fill=\"currentColor\"/>",
    	"width": 426,
    	"height": 512
    };

    var _default$6 = data$6;

    var data$5 = {
    	"body": "<path d=\"M128 204.667C145.062 136.227 187.738 102 256 102c102.4 0 115.2 77 166.4 89.833c34.138 8.56 64-4.273 89.6-38.5C494.938 221.773 452.262 256 384 256c-102.4 0-115.2-77-166.4-89.833c-34.138-8.56-64 4.273-89.6 38.5zm-128 154C17.062 290.227 59.738 256 128 256c102.4 0 115.2 77 166.4 89.833c34.138 8.56 64-4.273 89.6-38.5C366.938 375.773 324.262 410 256 410c-102.4 0-115.2-77-166.4-89.833c-34.138-8.56-64 4.273-89.6 38.5z\" fill=\"currentColor\"/>",
    	"width": 512,
    	"height": 512
    };

    var _default$5 = data$5;

    var data$4 = {
    	"body": "<path d=\"M10.483 12.482h3.034L12 8.831z\" fill=\"currentColor\"/><path d=\"M12 3.074L3.689 6.038l1.268 10.987l7.043 3.9l7.043-3.9l1.268-10.987L12 3.074zm5.187 13.621H15.25l-1.045-2.606h-4.41L8.75 16.695H6.813L12 5.047l5.187 11.648z\" fill=\"currentColor\"/>",
    	"width": 24,
    	"height": 24
    };

    var _default$4 = data$4;

    var data$3 = {
    	"body": "<path d=\"M12 21.985c-.275 0-.532-.074-.772-.202l-2.439-1.448c-.365-.203-.182-.277-.072-.314c.496-.165.588-.201 1.101-.493c.056-.037.129-.02.185.017l1.87 1.12c.074.036.166.036.221 0l7.319-4.237c.074-.036.11-.11.11-.202V7.768c0-.091-.036-.165-.11-.201l-7.319-4.219c-.073-.037-.165-.037-.221 0L4.552 7.566c-.073.036-.11.129-.11.201v8.457c0 .073.037.166.11.202l2 1.157c1.082.548 1.762-.095 1.762-.735V8.502c0-.11.091-.221.22-.221h.936c.108 0 .22.092.22.221v8.347c0 1.449-.788 2.294-2.164 2.294c-.422 0-.752 0-1.688-.46l-1.925-1.099a1.55 1.55 0 0 1-.771-1.34V7.786c0-.55.293-1.064.771-1.339l7.316-4.237a1.637 1.637 0 0 1 1.544 0l7.317 4.237c.479.274.771.789.771 1.339v8.458c0 .549-.293 1.063-.771 1.34l-7.317 4.236c-.241.11-.516.165-.773.165zm2.256-5.816c-3.21 0-3.87-1.468-3.87-2.714c0-.11.092-.221.22-.221h.954c.11 0 .201.073.201.184c.147.971.568 1.449 2.514 1.449c1.54 0 2.202-.35 2.202-1.175c0-.477-.185-.825-2.587-1.063c-1.999-.2-3.246-.643-3.246-2.238c0-1.485 1.247-2.366 3.339-2.366c2.347 0 3.503.809 3.649 2.568a.297.297 0 0 1-.056.165c-.037.036-.091.073-.146.073h-.953a.212.212 0 0 1-.202-.164c-.221-1.012-.789-1.34-2.292-1.34c-1.689 0-1.891.587-1.891 1.027c0 .531.237.696 2.514.99c2.256.293 3.32.715 3.32 2.294c-.02 1.615-1.339 2.531-3.67 2.531z\" fill=\"currentColor\"/>",
    	"width": 24,
    	"height": 24
    };

    var _default$3 = data$3;

    var data$2 = {
    	"body": "<path d=\"M21.62 11.108l-8.731-8.729a1.292 1.292 0 0 0-1.823 0L9.257 4.19l2.299 2.3a1.532 1.532 0 0 1 1.939 1.95l2.214 2.217a1.53 1.53 0 0 1 1.583 2.531c-.599.6-1.566.6-2.166 0a1.536 1.536 0 0 1-.337-1.662l-2.074-2.063V14.9c.146.071.286.169.407.29a1.537 1.537 0 0 1 0 2.166a1.536 1.536 0 0 1-2.174 0a1.528 1.528 0 0 1 0-2.164c.152-.15.322-.264.504-.339v-5.49a1.529 1.529 0 0 1-.83-2.008l-2.26-2.271l-5.987 5.982c-.5.504-.5 1.32 0 1.824l8.731 8.729a1.286 1.286 0 0 0 1.821 0l8.69-8.689a1.284 1.284 0 0 0 .003-1.822\" fill=\"currentColor\"/>",
    	"width": 24,
    	"height": 24
    };

    var _default$2 = data$2;

    var data$1 = {
    	"body": "<path d=\"M15.332 8.668a3.333 3.333 0 0 0 0-6.663H8.668a3.333 3.333 0 0 0 0 6.663a3.333 3.333 0 0 0 0 6.665a3.333 3.333 0 0 0 0 6.664A3.334 3.334 0 0 0 12 18.664V8.668h3.332z\" fill=\"currentColor\"/><circle cx=\"15.332\" cy=\"12\" r=\"3.332\" fill=\"currentColor\"/>",
    	"width": 24,
    	"height": 24
    };

    var _default$1 = data$1;

    var data = {
    	"body": "<g fill=\"none\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5zm1-3V6h12v12h-3V9h-3v9H6z\" fill=\"currentColor\"/></g>",
    	"width": 24,
    	"height": 24
    };

    var _default = data;

    /* src\Skill.svelte generated by Svelte v3.38.3 */
    const file$2 = "src\\Skill.svelte";

    function create_fragment$2(ctx) {
    	let div2;
    	let a;
    	let icon;
    	let t;
    	let div1;
    	let div0;
    	let current;

    	icon = new Icon({
    			props: {
    				icon: /*logo*/ ctx[0],
    				color: "#5E687E",
    				height: "28"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			a = element("a");
    			create_component(icon.$$.fragment);
    			t = space();
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "svelte-3wpv7s");
    			add_location(a, file$2, 9, 2, 135);
    			set_style(div0, "background-color", /*progressColor*/ ctx[2]);
    			set_style(div0, "width", /*progress*/ ctx[1] + "%");
    			attr_dev(div0, "class", "progress svelte-3wpv7s");
    			add_location(div0, file$2, 13, 4, 245);
    			attr_dev(div1, "class", "progress-bar svelte-3wpv7s");
    			add_location(div1, file$2, 12, 2, 213);
    			attr_dev(div2, "class", "skill svelte-3wpv7s");
    			add_location(div2, file$2, 8, 0, 112);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, a);
    			mount_component(icon, a, null);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const icon_changes = {};
    			if (dirty & /*logo*/ 1) icon_changes.icon = /*logo*/ ctx[0];
    			icon.$set(icon_changes);

    			if (!current || dirty & /*progressColor*/ 4) {
    				set_style(div0, "background-color", /*progressColor*/ ctx[2]);
    			}

    			if (!current || dirty & /*progress*/ 2) {
    				set_style(div0, "width", /*progress*/ ctx[1] + "%");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Skill", slots, []);
    	let { logo } = $$props, { progress } = $$props, { progressColor } = $$props;
    	const writable_props = ["logo", "progress", "progressColor"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Skill> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("logo" in $$props) $$invalidate(0, logo = $$props.logo);
    		if ("progress" in $$props) $$invalidate(1, progress = $$props.progress);
    		if ("progressColor" in $$props) $$invalidate(2, progressColor = $$props.progressColor);
    	};

    	$$self.$capture_state = () => ({ logo, progress, progressColor, Icon });

    	$$self.$inject_state = $$props => {
    		if ("logo" in $$props) $$invalidate(0, logo = $$props.logo);
    		if ("progress" in $$props) $$invalidate(1, progress = $$props.progress);
    		if ("progressColor" in $$props) $$invalidate(2, progressColor = $$props.progressColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [logo, progress, progressColor];
    }

    class Skill extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { logo: 0, progress: 1, progressColor: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skill",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*logo*/ ctx[0] === undefined && !("logo" in props)) {
    			console.warn("<Skill> was created without expected prop 'logo'");
    		}

    		if (/*progress*/ ctx[1] === undefined && !("progress" in props)) {
    			console.warn("<Skill> was created without expected prop 'progress'");
    		}

    		if (/*progressColor*/ ctx[2] === undefined && !("progressColor" in props)) {
    			console.warn("<Skill> was created without expected prop 'progressColor'");
    		}
    	}

    	get logo() {
    		throw new Error("<Skill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set logo(value) {
    		throw new Error("<Skill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get progress() {
    		throw new Error("<Skill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set progress(value) {
    		throw new Error("<Skill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get progressColor() {
    		throw new Error("<Skill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set progressColor(value) {
    		throw new Error("<Skill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Skills.svelte generated by Svelte v3.38.3 */
    const file$1 = "src\\Skills.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (78:6) {#each skillArea.skills as skill }
    function create_each_block_1(ctx) {
    	let skill;
    	let current;

    	skill = new Skill({
    			props: {
    				logo: /*skill*/ ctx[5].logo,
    				progress: /*skill*/ ctx[5].progress,
    				progressColor: /*skill*/ ctx[5].progress <= 70
    				? /*progressColor*/ ctx[0] = "#1CB12B"
    				: /*progressColor*/ ctx[0] = "#FF9F1A"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(skill.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(skill, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skill.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skill.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(skill, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(78:6) {#each skillArea.skills as skill }",
    		ctx
    	});

    	return block;
    }

    // (73:2) {#each skillsMock as skillArea}
    function create_each_block(ctx) {
    	let h5;
    	let t0_value = /*skillArea*/ ctx[2].area + "";
    	let t0;
    	let t1;
    	let div;
    	let t2;
    	let current;
    	let each_value_1 = /*skillArea*/ ctx[2].skills;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			attr_dev(h5, "class", "svelte-174m3e");
    			add_location(h5, file$1, 74, 4, 1464);
    			attr_dev(div, "class", "skills-area svelte-174m3e");
    			add_location(div, file$1, 76, 4, 1497);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			append_dev(h5, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*skillsMock, progressColor*/ 3) {
    				each_value_1 = /*skillArea*/ ctx[2].skills;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t2);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(73:2) {#each skillsMock as skillArea}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let section;
    	let h2;
    	let t1;
    	let current;
    	let each_value = /*skillsMock*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");
    			h2 = element("h2");
    			h2.textContent = "Skills";
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "skills-text svelte-174m3e");
    			add_location(h2, file$1, 70, 2, 1384);
    			attr_dev(section, "class", "skills-section svelte-174m3e");
    			add_location(section, file$1, 69, 0, 1348);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h2);
    			append_dev(section, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*skillsMock, progressColor*/ 3) {
    				each_value = /*skillsMock*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(section, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Skills", slots, []);
    	let progressColor;

    	let skillsMock = [
    		{
    			area: "Development",
    			skills: [
    				{
    					name: "Svelte",
    					progress: 65,
    					logo: _default$6
    				},
    				{
    					name: "Angular",
    					progress: 60,
    					logo: _default$4
    				},
    				{
    					name: "NodeJs",
    					progress: 80,
    					logo: _default$3
    				}
    			]
    		},
    		{
    			area: "Management",
    			skills: [
    				{ name: "Git", progress: 85, logo: _default$2 },
    				{ name: "NPM", progress: 75, logo: _default }
    			]
    		},
    		{
    			area: "Design",
    			skills: [
    				{
    					name: "Tailwind",
    					progress: 80,
    					logo: _default$5
    				},
    				{
    					name: "Figma",
    					progress: 70,
    					logo: _default$1
    				}
    			]
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Skills> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Icon,
    		svelteIcon: _default$6,
    		tailwindIcon: _default$5,
    		bxlAngular: _default$4,
    		bxlNodejs: _default$3,
    		bxlGit: _default$2,
    		bxlFigma: _default$1,
    		npmIcon: _default,
    		Skill,
    		progressColor,
    		skillsMock
    	});

    	$$self.$inject_state = $$props => {
    		if ("progressColor" in $$props) $$invalidate(0, progressColor = $$props.progressColor);
    		if ("skillsMock" in $$props) $$invalidate(1, skillsMock = $$props.skillsMock);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [progressColor, skillsMock];
    }

    class Skills extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.38.3 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let t0;
    	let hero;
    	let t1;
    	let skills;
    	let current;
    	header = new Header({ $$inline: true });
    	hero = new Hero({ $$inline: true });
    	skills = new Skills({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(hero.$$.fragment);
    			t1 = space();
    			create_component(skills.$$.fragment);
    			add_location(main, file, 9, 0, 145);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			mount_component(hero, main, null);
    			append_dev(main, t1);
    			mount_component(skills, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(hero.$$.fragment, local);
    			transition_in(skills.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(hero.$$.fragment, local);
    			transition_out(skills.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(hero);
    			destroy_component(skills);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Header, Hero, Skills });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
