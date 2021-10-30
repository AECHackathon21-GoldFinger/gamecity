import { createStore } from 'vuex'
import { toRaw } from 'vue'
import { projectDatabase, projectStorage } from '../firebase/config.js'

export default createStore({
    state: {
        projectName: String,
        projectLocation: String,
        saved: Boolean,
        voxels: []
    },
    getters: {

        getVoxels: (state) => {
            return state.voxels
        },

        getProjectName: (state) => {
            return state.projectName
        },
    },
    mutations: {

        storeVoxels(state, voxels) {
            state.voxels = voxels
            state.saved = true
        },

        setProjectInfo(state, projectName, projectLocation) {
            state.projectName = projectName
            state.projectLocation = projectLocation
        },
    },
    actions: {
    },
    modules: {},
})