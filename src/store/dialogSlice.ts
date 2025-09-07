import { PayloadAction } from '@reduxjs/toolkit/src/createAction';
import { createSlice } from './../../node_modules/@reduxjs/toolkit/src/createSlice';
import { DialogBoxProps } from "@/components/common/widgets/DialogBox/DialogBox";

export interface DialogState {
    isOpen: boolean;
    props: DialogBoxProps | null;
}

export const initialState: DialogState = {
    isOpen: false,
    props: null
}   

const dialogSlice = createSlice({
    name: "dialog",
    initialState,
    reducers: {
        // Action creator: Automatically create action objects for opening and closing the dialog
        openDialog: (state, action: PayloadAction<{ props: DialogBoxProps }>) => {
            state.isOpen = true;
            state.props = action.payload.props;
        },
        closeDialog: (state) => {
            state.isOpen = false;
            state.props = null;
        }
    }
});

export const { openDialog, closeDialog } = dialogSlice.actions;
export default dialogSlice.reducer;

// createSlice là cơ chế tạo ra các action creators và reducer một cách tự động
// Phần 'type' được tạo tự động theo nguyên tắc <actionName.type>
