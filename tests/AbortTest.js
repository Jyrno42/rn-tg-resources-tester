// @flow

// Compat issue 1: Needed due to https://github.com/facebook/react-native/issues/18115
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

import equal from 'deep-equal';

import { Component } from 'react';

import { AbortError } from 'tg-resources';
import { FetchResource as Resource } from '@tg-resources/fetch';


type Props = {
    apiRoot: string,

    onError: (e) => *,
    onSuccess: () => *,
};

type State = {
    controller: AbortController,
}

// TODO: Currently does not work see (https://github.com/facebook/react-native/issues/18115)
class AbortTest extends Component<Props, State> {
    state = {
        controller: new AbortController(),
    };

    async componentDidMount() {
        const { apiRoot, onError, onSuccess } = this.props;
        const { controller } = this.state;

        setTimeout(() => {
            controller.abort();
        }, 100);

        try {
            await new Resource('/abort', {
                apiRoot,
            }).fetch(null, null, {
                signal: controller.signal,
            });

            onError(new Error('Request should be aborted!'));         
        } catch (e) {
            console.error(e);

            if (!e || !e.isAbortError) {
                onError(new Error('Raised error should be an instance of AbortError')); 
                return;
            }
            
            if (!e.isAbortError || e.type !== 'aborted' || e.name !== 'AbortError') {
                onError(new Error(`AbortError signature is invalid: got=${JSON.stringify(e)}`));
                return;
            }

            onSuccess();
        }
    }

    render() {
        return null;
    }
}

export default AbortTest;
