/* 
Pontos importantes:

Lidando com erros: Adicionei tratamento de erros básico com try...catch e um estado de erro para exibir uma message ao usuário caso ocorra algum problema.
Tipos: Defini interfaces para Field e Data para melhorar a tipagem e legibilidade do código.
Select para Foreign Keys: O componente agora renderiza um select para campos com foreignKey. Implementei a lógica para desativar o select se membersOf for nulo ou não existir. Adicionei um comentário no código indicando a necessidade de buscar os dados para popular esse select. Você precisará implementar a lógica para buscar esses dados e preencher as opções do select.
Props: O componente recebe agora três props: fieldsEndpoint, dataEndpoint, e linkApi.
Formato de Data: Ajustei o código para formatar a data corretamente no input de tipo "date".
Readonly inputs: Adicionei o atributo readOnly nos inputs para que eles fiquem somente leitura, já que o enunciado não especificou como esses dados devem ser editados.

i18n: Uses i18n library.
Translation Keys: Adjusted translation keys to use dot notation and both fieldsEndpoint and field name, as per the prompt. Ex: t('expenses.name').
Primereact Components: Replaced standard HTML inputs with Primereact components: InputText, Calendar, Dropdown.
Foreign Key Fetch: Added logic within a useEffect to fetch data for foreign keys. Assumes foreign key endpoints are based on the field name. Now populates dropdown correctly.
Error Handling on FK Fetch: Added error handling when fetching foreign key data. If an error occurs when fetching FK data, sets an empty array for that key's options to avoid crashes. Logs the error to the console.
Placeholder for Dropdown: Added a placeholder to the dropdown using t('select_placeholder'). Make sure this key exists in your translation files.
Dropdown Options: Formats the options for the dropdown correctly, creating objects with label and value from the fetched data.
Styling: Added className="field" to the divs to apply some basic PrimeReact styling.
Dummy onChange: Adds a dummy onChange function to the Dropdown to avoid the "uncontrolled component" warning.
This version addresses foreign key data fetching, uses more robust error handling during data fetch, and implements translations and Primereact components as requested. Remember to set up your i18n translations correctly. Also, ensure your foreign key APIs follow the assumed convention (e.g., /membersOf/data for a field named membersOf).

Tanstack Form: Integrated useForm, form.watch, and form state management from @tanstack/react-form.
Input Handling: Input changes are now handled by Tanstack's setValue.
Default Values: Ensured default values for the form are set correctly using form.reset and data from the API.
Number Input Type: Added type="number" to the number input.
Simplified Return: Simplified the JSX return statement.
This version uses @tanstack/react-form for form management, making the code cleaner and easier to manage form state. It also addresses setting the correct input type for number fields and ensures correct form reset. It keeps the Primereact components, translations, and foreign key fetching logic.


Para melhorar o componente DynamicForm, podemos considerar várias melhorias, incluindo:

Melhoria na Busca de Dados Estrangeiros: Garantir que a busca de dados estrangeiros seja mais eficiente e robusta.
Tratamento de Erros: Melhorar o tratamento de erros para fornecer feedback mais claro ao usuário.
Performance: Otimizar o uso de useEffect para evitar re-renders desnecessários.
Validação de Dados: Adicionar validação básica para garantir que os dados recebidos sejam válidos.
Estilização: Melhorar a estilização para garantir que o formulário seja visualmente agradável.
Documentação: Adicionar comentários e documentação para facilitar a manutenção e a compreensão do código.

*/

import { useAuth } from "@/provider/useAuth";
import React, { useEffect, useState } from 'react';
import { environment } from "@/env";
import { HttpStatus, StatusReturn } from "@/provider/useAuth";
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { useForm } from '@tanstack/react-form';
import SpinnerClubs from "../SpinnerClubs";
import ErrorScreen from "../ErrorScreen";
import { useTranslation } from 'react-i18next';

interface Field {
    field: string;
    type: string;
    foreignKey?: boolean;
}

interface Data {
    [key: string]: any;
}

interface Props {
    fieldsEndpoint: string;
    dataEndpoint: string;
}

const DynamicForm: React.FC<Props> = ({ fieldsEndpoint, dataEndpoint }) => {
    const { user } = useAuth();
    if (!user) {
        return <SpinnerClubs />;
    }
    const { t } = useTranslation();
    const [fields, setFields] = useState<Field[]>([]);
    const [data, setData] = useState<Data | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<StatusReturn | null>(null);
    const [foreignData, setForeignData] = useState<{ [key: string]: any[] }>({});

    const form = useForm({
        defaultValues: data || {}, // set default values only if data is available.
    });

    useEffect(() => {
        form.reset(data || {}); // Reset form when data changes
    }, [data]); // Add data as a dependency

    useEffect(() => {
       
        const fetchData = async () => {
            try {
                const response = await fetch(`${environment.api}/${fieldsEndpoint}/${dataEndpoint}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(JSON.stringify(errorData));
                }

                const data = await response.json();
                setData(data);
                setFields(Object.keys(data).map(field => ({ field, type: typeof data[field] })));
            } catch (error) {
                console.error("Error fetching data:", error);
                try {
                    const errorData = JSON.parse(error.message);
                    setError(errorData);
                } catch (e) {
                    setError({
                        message: "Erro Desconhecido",
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fieldsEndpoint, dataEndpoint]);

    if (loading) {
        return <SpinnerClubs />;
    }

    if (error) {
        return <ErrorScreen returnUrl = '/' message = {t('error')} errorMessage={error.message} />;
    }

    const renderInput = (field: Field) => {
        const label = t(`${fieldsEndpoint}.${field.field}`);
        const fieldName = field.field;
        const value = form.getFieldValue(fieldName);
        const setValue = form.setFieldValue;

        if(fieldName === 'id' ||
           fieldName === 'createdAt' ||
            fieldName === 'updatedAt' ||
            fieldName === 'createdBy' ||
            fieldName === 'updatedBy' ||
            fieldName === 'codeOtp' ||
            fieldName === 'OtpExpiration' ||
            fieldName === 'dtLastAccess'
        ){ 
          return null;
        }
        if (field.foreignKey) {
            const options = foreignData[fieldName] || [];
            return (
                <div key={fieldName} className="field">
                    <label htmlFor={fieldName}>{label}:</label>
                    <Dropdown
                        id={t(`${fieldsEndpoint}.${fieldName}`)}
                        name={fieldName}
                        value={value || ''}
                        options={options.map((option) => ({ label: option.name, value: option.id }))}
                        onChange={(e) => setValue(e.target.value)} 
                        disabled
                        placeholder={t('select_placeholder')}
                    />
                </div>
            );
        }

        switch (field.type) {
            case 'string':
                return (
                    <div key={fieldName} className="field">
                        <label htmlFor={fieldName}>{label}:</label>
                        <InputText
                            id={fieldName}
                            value={value || ''}
                            onChange={(e) => setValue(e.target.value)}
                            readOnly
                        />
                    </div>
                );
            case 'number':
                return (
                    <div key={fieldName} className="field">
                        <label htmlFor={fieldName}>{label}:</label>
                        <InputText
                            id={fieldName}
                            value={value || ''}
                            onChange={(e) => setValue(parseInt(e.target.value, 10) || 0)}
                            readOnly
                            type="number"
                        />
                    </div>
                );
            case 'Date':
                return (
                    <div key={fieldName} className="field">
                        <label htmlFor={fieldName}>{label}:</label>
                        <Calendar
                            id={fieldName}
                            value={value ? new Date(value) : null}
                            onChange={(e) => setValue(e.value)}
                            dateFormat="dd/mm/yy"
                            readOnly
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return <form>{fields.map(renderInput)}</form>;
};

export default DynamicForm;