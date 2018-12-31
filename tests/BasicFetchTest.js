// @flow
import equal from 'deep-equal';

import { Component } from 'react';

import { FetchResource as Resource } from '@tg-resources/fetch';


type Props = {
    apiRoot: string,

    onError: (e) => *,
    onSuccess: () => *,
};

class BasicFetchTest extends Component<Props> {
    async componentDidMount() {
        const { apiRoot, onError, onSuccess } = this.props;

        try {
            const result = await new Resource('/hello', {
                apiRoot,
            }).fetch();

            if (equal(result, { message: 'world' })) {
                onSuccess();
            } else {
                onError(new Error(`Response does not match expected result: got=${JSON.stringify(result)}`));
            }            
        } catch (e) {
            onError(e);
        }
    }

    render() {
        return null;
    }
}

export default BasicFetchTest;
