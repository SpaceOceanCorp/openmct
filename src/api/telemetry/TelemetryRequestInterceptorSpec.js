/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2024, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

import TelemetryRequestInterceptorRegistry from './TelemetryRequestInterceptor.js';

describe('The telemetry request interceptor registry', () => {
  let registry;

  function interceptor(name, priority, applies = true) {
    return { name, priority, appliesTo: () => applies, invoke: (request) => request };
  }

  function names(interceptors) {
    return interceptors.map(({ name }) => name);
  }

  beforeEach(() => {
    registry = new TelemetryRequestInterceptorRegistry();
  });

  it('returns applicable interceptors with the highest priority first', () => {
    registry.addInterceptor(interceptor('low', 1));
    registry.addInterceptor(interceptor('high', 10));

    expect(names(registry.getInterceptors({}, {}))).toEqual(['high', 'low']);
  });

  it('treats a missing priority as the default', () => {
    registry.addInterceptor(interceptor('negative', -1));
    registry.addInterceptor(interceptor('none'));
    registry.addInterceptor(interceptor('positive', 1));

    expect(names(registry.getInterceptors({}, {}))).toEqual(['positive', 'none', 'negative']);
  });

  it('keeps registration order for equal priorities', () => {
    registry.addInterceptor(interceptor('first', 5));
    registry.addInterceptor(interceptor('second', 5));

    expect(names(registry.getInterceptors({}, {}))).toEqual(['first', 'second']);
  });

  it('leaves out interceptors that do not apply', () => {
    registry.addInterceptor(interceptor('skipped', 10, false));
    registry.addInterceptor(interceptor('used', 1));

    expect(names(registry.getInterceptors({}, {}))).toEqual(['used']);
  });
});
