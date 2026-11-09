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

import { getValidatedData, getValidatedGroups } from './util.js';

describe('the plan util functions', () => {
  function planWithBody(body, sourceMap) {
    return {
      sourceMap,
      selectFile: { body: JSON.stringify(body) }
    };
  }

  const sourceMap = {
    orderedGroups: 'groups',
    activities: 'activities',
    groupId: 'group'
  };

  it('treats a mapping to missing activities as an empty plan', () => {
    expect(getValidatedData(planWithBody({ other: [] }, sourceMap))).toEqual({});
  });

  it('treats a mapping to non-array activities as an empty plan', () => {
    expect(getValidatedData(planWithBody({ activities: 'none' }, sourceMap))).toEqual({});
  });

  it('still maps activities that exist', () => {
    const activity = { group: 'a', name: 'one' };
    const planData = getValidatedData(planWithBody({ activities: [activity] }, sourceMap));

    expect(planData).toEqual({ a: [activity] });
  });

  it('falls back to the plan data keys when ordered groups are missing', () => {
    const groups = getValidatedGroups(planWithBody({ other: [] }, sourceMap), { a: [], b: [] });

    expect(groups).toEqual(['a', 'b']);
  });

  it('still uses ordered group names that exist', () => {
    const body = { groups: [{ name: 'b' }, { name: 'a' }] };

    expect(getValidatedGroups(planWithBody(body, sourceMap), { a: [], b: [] })).toEqual(['b', 'a']);
  });
});
