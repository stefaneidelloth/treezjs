/*! This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import "./styles/main.scss";
import "./components/notebook";
import * as lit from "lit";
import { RuntimeConfig } from "./types";
declare global {
    interface Window {
        initialNotebookContent?: string;
        starboardArtifactsUrl?: string;
        runtimeConfig?: Partial<RuntimeConfig>;
        html: typeof lit.html;
        svg: typeof lit.svg;
        lit: typeof lit;
    }
}
