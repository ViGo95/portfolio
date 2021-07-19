
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
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

    /* src/Main.svelte generated by Svelte v3.38.3 */

    const file$4 = "src/Main.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i].title;
    	child_ctx[10] = list[i].url;
    	child_ctx[11] = list[i].image;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i].title;
    	child_ctx[10] = list[i].url;
    	child_ctx[11] = list[i].image;
    	return child_ctx;
    }

    // (103:2) {:else }
    function create_else_block_1(ctx) {
    	let div;
    	let each_value_1 = /*netSkills*/ ctx[6];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "skills svelte-1yunfhc");
    			add_location(div, file$4, 104, 4, 2184);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*netSkills*/ 64) {
    				each_value_1 = /*netSkills*/ ctx[6];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(103:2) {:else }",
    		ctx
    	});

    	return block;
    }

    // (99:2) {#if heroPosition != 'heroNetPosition'}
    function create_if_block_1(ctx) {
    	let a;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text("Web Developer");
    			attr_dev(a, "class", "heroTitle svelte-1yunfhc");
    			attr_dev(a, "href", "#");
    			attr_dev(a, "style", /*titlePosition*/ ctx[2]);
    			add_location(a, file$4, 100, 4, 2073);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*webClick*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*titlePosition*/ 4) {
    				attr_dev(a, "style", /*titlePosition*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(99:2) {#if heroPosition != 'heroNetPosition'}",
    		ctx
    	});

    	return block;
    }

    // (107:6) {#each netSkills as {title, url, image}}
    function create_each_block_1(ctx) {
    	let a;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			img = element("img");
    			if (img.src !== (img_src_value = /*image*/ ctx[11])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*title*/ ctx[9]);
    			attr_dev(img, "class", "svelte-1yunfhc");
    			add_location(img, file$4, 107, 40, 2293);
    			attr_dev(a, "href", /*url*/ ctx[10]);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-1yunfhc");
    			add_location(a, file$4, 107, 8, 2261);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(107:6) {#each netSkills as {title, url, image}}",
    		ctx
    	});

    	return block;
    }

    // (121:2) {:else }
    function create_else_block(ctx) {
    	let div;
    	let each_value = /*devSkills*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "skills svelte-1yunfhc");
    			add_location(div, file$4, 122, 4, 2638);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*devSkills*/ 32) {
    				each_value = /*devSkills*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(121:2) {:else }",
    		ctx
    	});

    	return block;
    }

    // (117:2) {#if heroPosition != 'heroWebPosition'}
    function create_if_block$1(ctx) {
    	let a;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text("Network Admin");
    			attr_dev(a, "class", "heroTitle svelte-1yunfhc");
    			attr_dev(a, "href", "#");
    			attr_dev(a, "style", /*titlePosition*/ ctx[2]);
    			add_location(a, file$4, 118, 4, 2527);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*netClick*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*titlePosition*/ 4) {
    				attr_dev(a, "style", /*titlePosition*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(117:2) {#if heroPosition != 'heroWebPosition'}",
    		ctx
    	});

    	return block;
    }

    // (125:6) {#each devSkills as {title, url, image}}
    function create_each_block(ctx) {
    	let a;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			img = element("img");
    			if (img.src !== (img_src_value = /*image*/ ctx[11])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*title*/ ctx[9]);
    			attr_dev(img, "class", "svelte-1yunfhc");
    			add_location(img, file$4, 125, 40, 2747);
    			attr_dev(a, "href", /*url*/ ctx[10]);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-1yunfhc");
    			add_location(a, file$4, 125, 8, 2715);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(125:6) {#each devSkills as {title, url, image}}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let t0;
    	let img0;
    	let img0_class_value;
    	let img0_src_value;
    	let t1;
    	let img1;
    	let img1_class_value;
    	let img1_src_value;
    	let t2;

    	function select_block_type(ctx, dirty) {
    		if (/*heroPosition*/ ctx[1] != "heroNetPosition") return create_if_block_1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*heroPosition*/ ctx[1] != "heroWebPosition") return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block0.c();
    			t0 = space();
    			img0 = element("img");
    			t1 = space();
    			img1 = element("img");
    			t2 = space();
    			if_block1.c();
    			attr_dev(img0, "class", img0_class_value = "ark " + /*heroPosition*/ ctx[1] + " svelte-1yunfhc");
    			if (img0.src !== (img0_src_value = /*arco*/ ctx[3])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			add_location(img0, file$4, 113, 2, 2368);
    			attr_dev(img1, "class", img1_class_value = "photo " + /*heroPosition*/ ctx[1] + " svelte-1yunfhc");
    			if (img1.src !== (img1_src_value = /*photo*/ ctx[4])) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			add_location(img1, file$4, 114, 2, 2423);
    			set_style(main, "--theme-color", /*mainColor*/ ctx[0]);
    			attr_dev(main, "class", "svelte-1yunfhc");
    			add_location(main, file$4, 96, 0, 1983);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_block0.m(main, null);
    			append_dev(main, t0);
    			append_dev(main, img0);
    			append_dev(main, t1);
    			append_dev(main, img1);
    			append_dev(main, t2);
    			if_block1.m(main, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(main, t0);
    				}
    			}

    			if (dirty & /*heroPosition*/ 2 && img0_class_value !== (img0_class_value = "ark " + /*heroPosition*/ ctx[1] + " svelte-1yunfhc")) {
    				attr_dev(img0, "class", img0_class_value);
    			}

    			if (dirty & /*heroPosition*/ 2 && img1_class_value !== (img1_class_value = "photo " + /*heroPosition*/ ctx[1] + " svelte-1yunfhc")) {
    				attr_dev(img1, "class", img1_class_value);
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(main, null);
    				}
    			}

    			if (dirty & /*mainColor*/ 1) {
    				set_style(main, "--theme-color", /*mainColor*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_block0.d();
    			if_block1.d();
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
    	validate_slots("Main", slots, []);
    	let { mainColor } = $$props;
    	let arco = "images/arco.svg";
    	let photo = "images/photo.svg";
    	let heroPosition = "mainPosition";
    	let titlePosition = "";

    	const devSkills = [
    		{
    			title: "Svelte",
    			url: "https://svelte.dev/",
    			image: ""
    		},
    		{
    			title: "NodeJS",
    			url: "https://nodejs.org/en/docs/",
    			image: ""
    		},
    		{
    			title: "MongoDB",
    			url: "https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_footprint_row_search_core_brand_atlas_desktop&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624584",
    			image: ""
    		},
    		{
    			title: "TailwindCSS",
    			url: "https://tailwindcss.com/",
    			image: ""
    		},
    		{
    			title: "Figma",
    			url: "https://www.figma.com",
    			image: ""
    		}
    	];

    	const netSkills = [
    		{
    			title: "Fortinet",
    			url: "https://svelte.dev/",
    			image: ""
    		},
    		{
    			title: "Cisco",
    			url: "https://nodejs.org/en/docs/",
    			image: ""
    		},
    		{
    			title: "Ubiquiti",
    			url: "https://www.mongodb.com/cloud/atlas/lp/try2?utm_source=google&utm_campaign=gs_footprint_row_search_core_brand_atlas_desktop&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624584",
    			image: ""
    		},
    		{
    			title: "Cabling",
    			url: "https://tailwindcss.com/",
    			image: ""
    		},
    		{
    			title: "Design",
    			url: "https://www.figma.com",
    			image: ""
    		}
    	];

    	function webClick() {
    		if (heroPosition != "heroWebPosition") {
    			$$invalidate(1, heroPosition = "heroWebPosition");
    			$$invalidate(2, titlePosition = "margin-left: 200px");
    		} else {
    			$$invalidate(1, heroPosition = "mainPosition");
    			$$invalidate(2, titlePosition = "");
    		}
    	}

    	function netClick() {
    		if (heroPosition != "heroNetPosition") {
    			$$invalidate(1, heroPosition = "heroNetPosition");
    			$$invalidate(2, titlePosition = "margin-right: 200px;");
    		} else {
    			$$invalidate(1, heroPosition = "mainPosition");
    			$$invalidate(2, titlePosition = "");
    		}
    	}

    	const writable_props = ["mainColor"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("mainColor" in $$props) $$invalidate(0, mainColor = $$props.mainColor);
    	};

    	$$self.$capture_state = () => ({
    		mainColor,
    		arco,
    		photo,
    		heroPosition,
    		titlePosition,
    		devSkills,
    		netSkills,
    		webClick,
    		netClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("mainColor" in $$props) $$invalidate(0, mainColor = $$props.mainColor);
    		if ("arco" in $$props) $$invalidate(3, arco = $$props.arco);
    		if ("photo" in $$props) $$invalidate(4, photo = $$props.photo);
    		if ("heroPosition" in $$props) $$invalidate(1, heroPosition = $$props.heroPosition);
    		if ("titlePosition" in $$props) $$invalidate(2, titlePosition = $$props.titlePosition);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		mainColor,
    		heroPosition,
    		titlePosition,
    		arco,
    		photo,
    		devSkills,
    		netSkills,
    		webClick,
    		netClick
    	];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { mainColor: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*mainColor*/ ctx[0] === undefined && !("mainColor" in props)) {
    			console.warn("<Main> was created without expected prop 'mainColor'");
    		}
    	}

    	get mainColor() {
    		throw new Error("<Main>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mainColor(value) {
    		throw new Error("<Main>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Header.svelte generated by Svelte v3.38.3 */

    const file$3 = "src/Header.svelte";

    function create_fragment$3(ctx) {
    	let header;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let nav;
    	let a0;
    	let t2;
    	let a1;
    	let t4;
    	let img1;
    	let img1_src_value;
    	let t5;
    	let a2;
    	let t7;
    	let a3;
    	let t9;
    	let button;
    	let div;

    	const block = {
    		c: function create() {
    			header = element("header");
    			img0 = element("img");
    			t0 = space();
    			nav = element("nav");
    			a0 = element("a");
    			a0.textContent = "About me";
    			t2 = space();
    			a1 = element("a");
    			a1.textContent = "Skills";
    			t4 = space();
    			img1 = element("img");
    			t5 = space();
    			a2 = element("a");
    			a2.textContent = "Projects";
    			t7 = space();
    			a3 = element("a");
    			a3.textContent = "Contact";
    			t9 = space();
    			button = element("button");
    			div = element("div");
    			if (img0.src !== (img0_src_value = /*flag*/ ctx[1])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Flag");
    			attr_dev(img0, "width", "38");
    			add_location(img0, file$3, 8, 2, 156);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "svelte-tyk1go");
    			add_location(a0, file$3, 11, 4, 208);
    			attr_dev(a1, "href", "/");
    			attr_dev(a1, "class", "svelte-tyk1go");
    			add_location(a1, file$3, 12, 4, 237);
    			if (img1.src !== (img1_src_value = /*logo*/ ctx[2])) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Logo");
    			attr_dev(img1, "width", "58px");
    			attr_dev(img1, "height", "51.5px");
    			add_location(img1, file$3, 13, 4, 264);
    			attr_dev(a2, "href", "/");
    			attr_dev(a2, "class", "svelte-tyk1go");
    			add_location(a2, file$3, 14, 4, 325);
    			attr_dev(a3, "href", "/");
    			attr_dev(a3, "class", "svelte-tyk1go");
    			add_location(a3, file$3, 15, 4, 354);
    			attr_dev(nav, "class", "svelte-tyk1go");
    			add_location(nav, file$3, 10, 2, 198);
    			attr_dev(div, "class", "svelte-tyk1go");
    			add_location(div, file$3, 19, 4, 403);
    			attr_dev(button, "class", "svelte-tyk1go");
    			add_location(button, file$3, 18, 2, 390);
    			set_style(header, "--theme-color", /*mainColor*/ ctx[0]);
    			attr_dev(header, "class", "svelte-tyk1go");
    			add_location(header, file$3, 7, 0, 110);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, img0);
    			append_dev(header, t0);
    			append_dev(header, nav);
    			append_dev(nav, a0);
    			append_dev(nav, t2);
    			append_dev(nav, a1);
    			append_dev(nav, t4);
    			append_dev(nav, img1);
    			append_dev(nav, t5);
    			append_dev(nav, a2);
    			append_dev(nav, t7);
    			append_dev(nav, a3);
    			append_dev(header, t9);
    			append_dev(header, button);
    			append_dev(button, div);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*mainColor*/ 1) {
    				set_style(header, "--theme-color", /*mainColor*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
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
    	validate_slots("Header", slots, []);
    	let { mainColor } = $$props;
    	let flag = "images/VEN_Flag.svg";
    	let logo = "images/Logo.svg";
    	const writable_props = ["mainColor"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("mainColor" in $$props) $$invalidate(0, mainColor = $$props.mainColor);
    	};

    	$$self.$capture_state = () => ({ mainColor, flag, logo });

    	$$self.$inject_state = $$props => {
    		if ("mainColor" in $$props) $$invalidate(0, mainColor = $$props.mainColor);
    		if ("flag" in $$props) $$invalidate(1, flag = $$props.flag);
    		if ("logo" in $$props) $$invalidate(2, logo = $$props.logo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [mainColor, flag, logo];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { mainColor: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*mainColor*/ ctx[0] === undefined && !("mainColor" in props)) {
    			console.warn("<Header> was created without expected prop 'mainColor'");
    		}
    	}

    	get mainColor() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mainColor(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Message.svelte generated by Svelte v3.38.3 */

    const file$2 = "src/Message.svelte";

    function create_fragment$2(ctx) {
    	let form;
    	let button;
    	let t1;
    	let p;
    	let t3;
    	let input0;
    	let t4;
    	let input1;

    	const block = {
    		c: function create() {
    			form = element("form");
    			button = element("button");
    			button.textContent = "X";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Enviame un mensaje!";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			input1 = element("input");
    			attr_dev(button, "class", "svelte-rbhtl7");
    			add_location(button, file$2, 5, 2, 40);
    			add_location(p, file$2, 8, 2, 69);
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "placeholder", "Cual es tu correo?");
    			add_location(input0, file$2, 9, 2, 98);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Escribeme un mensaje");
    			add_location(input1, file$2, 10, 2, 154);
    			attr_dev(form, "action", "");
    			attr_dev(form, "class", "svelte-rbhtl7");
    			add_location(form, file$2, 4, 0, 21);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, button);
    			append_dev(form, t1);
    			append_dev(form, p);
    			append_dev(form, t3);
    			append_dev(form, input0);
    			append_dev(form, t4);
    			append_dev(form, input1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
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

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Message", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Message> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Message extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Message",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.38.3 */

    const { console: console_1 } = globals;
    const file$1 = "src/Footer.svelte";

    // (29:6) {#if letMessage}
    function create_if_block(ctx) {
    	let message;
    	let current;
    	message = new Message({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(message.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(message, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(message.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(message.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(message, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(29:6) {#if letMessage}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let footer;
    	let div;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let a2;
    	let img2;
    	let img2_src_value;
    	let t2;
    	let a3;
    	let img3;
    	let img3_src_value;
    	let t3;
    	let t4;
    	let button;
    	let img4;
    	let img4_src_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*letMessage*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t0 = space();
    			a1 = element("a");
    			img1 = element("img");
    			t1 = space();
    			a2 = element("a");
    			img2 = element("img");
    			t2 = space();
    			a3 = element("a");
    			img3 = element("img");
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			button = element("button");
    			img4 = element("img");
    			if (img0.src !== (img0_src_value = /*github*/ ctx[2])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			attr_dev(img0, "class", "svelte-1ktno0q");
    			add_location(img0, file$1, 22, 42, 480);
    			attr_dev(a0, "href", "https://github.com/ViGo95");
    			attr_dev(a0, "class", "svelte-1ktno0q");
    			add_location(a0, file$1, 22, 6, 444);
    			if (img1.src !== (img1_src_value = /*linkedin*/ ctx[3])) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			attr_dev(img1, "class", "svelte-1ktno0q");
    			add_location(img1, file$1, 23, 51, 561);
    			attr_dev(a1, "href", "https://linkedin.com/in/luis-viñas");
    			attr_dev(a1, "class", "svelte-1ktno0q");
    			add_location(a1, file$1, 23, 6, 516);
    			if (img2.src !== (img2_src_value = /*twitter*/ ctx[5])) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "");
    			attr_dev(img2, "class", "svelte-1ktno0q");
    			add_location(img2, file$1, 24, 43, 636);
    			attr_dev(a2, "href", "https://twitter.com/Vi__Go");
    			attr_dev(a2, "class", "svelte-1ktno0q");
    			add_location(a2, file$1, 24, 6, 599);
    			if (img3.src !== (img3_src_value = /*instagram*/ ctx[4])) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "");
    			attr_dev(img3, "class", "svelte-1ktno0q");
    			add_location(img3, file$1, 25, 52, 719);
    			attr_dev(a3, "href", "https://www.instagram.com/vigo.dev/");
    			attr_dev(a3, "class", "svelte-1ktno0q");
    			add_location(a3, file$1, 25, 6, 673);
    			attr_dev(div, "class", "svelte-1ktno0q");
    			add_location(div, file$1, 21, 4, 432);
    			if (img4.src !== (img4_src_value = /*mail*/ ctx[6])) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "");
    			attr_dev(img4, "class", "svelte-1ktno0q");
    			add_location(img4, file$1, 33, 4, 872);
    			attr_dev(button, "class", "svelte-1ktno0q");
    			add_location(button, file$1, 32, 2, 832);
    			set_style(footer, "--theme-color", /*mainColor*/ ctx[0]);
    			attr_dev(footer, "class", "svelte-1ktno0q");
    			add_location(footer, file$1, 20, 2, 384);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    			append_dev(div, a0);
    			append_dev(a0, img0);
    			append_dev(div, t0);
    			append_dev(div, a1);
    			append_dev(a1, img1);
    			append_dev(div, t1);
    			append_dev(div, a2);
    			append_dev(a2, img2);
    			append_dev(div, t2);
    			append_dev(div, a3);
    			append_dev(a3, img3);
    			append_dev(footer, t3);
    			if (if_block) if_block.m(footer, null);
    			append_dev(footer, t4);
    			append_dev(footer, button);
    			append_dev(button, img4);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*changeMessage*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*letMessage*/ ctx[1]) {
    				if (if_block) {
    					if (dirty & /*letMessage*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(footer, t4);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*mainColor*/ 1) {
    				set_style(footer, "--theme-color", /*mainColor*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
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
    	validate_slots("Footer", slots, []);
    	let { mainColor } = $$props;
    	let github = "images/github.svg";
    	let linkedin = "images/linkedin.svg";
    	let instagram = "images/instagram.svg";
    	let twitter = "images/twitter.svg";
    	let mail = "images/mail.svg";
    	let letMessage = false;

    	function changeMessage() {
    		console.log("message");
    		$$invalidate(1, letMessage = true);
    	}

    	const writable_props = ["mainColor"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("mainColor" in $$props) $$invalidate(0, mainColor = $$props.mainColor);
    	};

    	$$self.$capture_state = () => ({
    		Message,
    		mainColor,
    		github,
    		linkedin,
    		instagram,
    		twitter,
    		mail,
    		letMessage,
    		changeMessage
    	});

    	$$self.$inject_state = $$props => {
    		if ("mainColor" in $$props) $$invalidate(0, mainColor = $$props.mainColor);
    		if ("github" in $$props) $$invalidate(2, github = $$props.github);
    		if ("linkedin" in $$props) $$invalidate(3, linkedin = $$props.linkedin);
    		if ("instagram" in $$props) $$invalidate(4, instagram = $$props.instagram);
    		if ("twitter" in $$props) $$invalidate(5, twitter = $$props.twitter);
    		if ("mail" in $$props) $$invalidate(6, mail = $$props.mail);
    		if ("letMessage" in $$props) $$invalidate(1, letMessage = $$props.letMessage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		mainColor,
    		letMessage,
    		github,
    		linkedin,
    		instagram,
    		twitter,
    		mail,
    		changeMessage
    	];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { mainColor: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*mainColor*/ ctx[0] === undefined && !("mainColor" in props)) {
    			console_1.warn("<Footer> was created without expected prop 'mainColor'");
    		}
    	}

    	get mainColor() {
    		throw new Error("<Footer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mainColor(value) {
    		throw new Error("<Footer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.38.3 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main1;
    	let header;
    	let t0;
    	let main0;
    	let t1;
    	let footer;
    	let current;

    	header = new Header({
    			props: { mainColor: /*mainColor*/ ctx[0] },
    			$$inline: true
    		});

    	main0 = new Main({
    			props: { mainColor: /*mainColor*/ ctx[0] },
    			$$inline: true
    		});

    	footer = new Footer({
    			props: { mainColor: /*mainColor*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main1 = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(main0.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    			add_location(main1, file, 8, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main1, anchor);
    			mount_component(header, main1, null);
    			append_dev(main1, t0);
    			mount_component(main0, main1, null);
    			append_dev(main1, t1);
    			mount_component(footer, main1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const header_changes = {};
    			if (dirty & /*mainColor*/ 1) header_changes.mainColor = /*mainColor*/ ctx[0];
    			header.$set(header_changes);
    			const main0_changes = {};
    			if (dirty & /*mainColor*/ 1) main0_changes.mainColor = /*mainColor*/ ctx[0];
    			main0.$set(main0_changes);
    			const footer_changes = {};
    			if (dirty & /*mainColor*/ 1) footer_changes.mainColor = /*mainColor*/ ctx[0];
    			footer.$set(footer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(main0.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(main0.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main1);
    			destroy_component(header);
    			destroy_component(main0);
    			destroy_component(footer);
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
    	let { mainColor } = $$props;
    	const writable_props = ["mainColor"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("mainColor" in $$props) $$invalidate(0, mainColor = $$props.mainColor);
    	};

    	$$self.$capture_state = () => ({ mainColor, Main, Header, Footer });

    	$$self.$inject_state = $$props => {
    		if ("mainColor" in $$props) $$invalidate(0, mainColor = $$props.mainColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [mainColor];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { mainColor: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*mainColor*/ ctx[0] === undefined && !("mainColor" in props)) {
    			console.warn("<App> was created without expected prop 'mainColor'");
    		}
    	}

    	get mainColor() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mainColor(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		mainColor: '#2F3640',
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
