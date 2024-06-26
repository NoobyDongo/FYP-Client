'use client'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60000 }}
})
export default function TableWrapper({children}) {

    return (
        <QueryClientProvider client={queryClient}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                {children}
            </LocalizationProvider>
        </QueryClientProvider>
    )
}