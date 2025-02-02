import React, { FormEventHandler, FunctionComponent, useEffect, useState } from 'react'
import { Button, TextField, Grid, Alert, Typography } from '@mui/material'
import { EditorState, convertToRaw } from 'draft-js'
import AddIcon from '@mui/icons-material/Add'
import { useSelector } from 'react-redux'

import { gameObj, gameState, trueOrFalseOptions, trueOrFalseQuestion } from 'types'
import DisciplineSelect from 'components/DisciplineSelect/DisciplineSelect'
import TrueOrFalseCell from 'components/TrueOrFalseCell/TrueOrFalseCell'
import BackFAButton from 'components/BackFAButton/BackFAButton'
import SeriesSelect from 'components/SeriesSelect/SeriesSelect'
import LayoutSelect from 'components/LayoutSelect/LayoutSelect'
import SuccessModal from 'components/SuccessModal/SuccessModal'
import { useCreateTrueOrFalseMutation } from 'services/games'
import { useCreateGameObjectMutation } from 'services/portal'
import draftToText from 'utils/draftToText'
import { getError } from 'utils/errors'
import { RootState } from 'store'

const NewTrueOrFalsePage: FunctionComponent = () => {
    const { token, origin } = useSelector((state: RootState) => state.user)
    const [open, setOpen] = useState(false)
    const [alert, setAlert] = useState('')
    const [name, setName] = useState('')
    const [layout, setLayout] = useState(1)
    const [serie, setSerie] = useState<string[]>([])
    const [discipline, setDiscipline] = useState('')
    const [createTrueOrFalse, response] = useCreateTrueOrFalseMutation()
    const [createGameObject, responsePortal] = useCreateGameObjectMutation()
    const initialState: trueOrFalseQuestion[] = [{ title: EditorState.createEmpty(), answer: false }]
    const [questions, setQuestions] = useState(initialState)

    const handleCreateQuestion = () => {
        if (questions.length >= 8) {
            setAlert('O número máximo de questões para esse jogo é 8!')
            return
        }
        setQuestions([...questions, { title: EditorState.createEmpty(), answer: false }])
    }

    const handleClose = () => {
        setName('')
        setQuestions([{ title: EditorState.createEmpty(), answer: false }])
        setLayout(1)
        setOpen(false)
    }

    const handleSubmit: FormEventHandler = (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault()
        if (serie === ['']) {
            setAlert('Selecione uma série!')
            return
        }
        if (discipline === '') {
            setAlert('Selecione uma disciplina!')
            return
        }
        let questionsJSON: trueOrFalseQuestion[] = []
        let error = false
        questions.map((item: trueOrFalseQuestion) => {
            const title = item.title as EditorState
            let content = title.getCurrentContent()
            if (content.getPlainText('').length === 0) {
                setAlert('Preencha todos os campos!')
                error = true
                return
            }
            let textJson = convertToRaw(content)
            let markup = draftToText(textJson)
            questionsJSON.push({
                answer: item.answer,
                title: markup,
            })
        })
        if (error) {
            return
        }
        let body: gameState<trueOrFalseOptions> = {
            name: name,
            layout: layout,
            options: questionsJSON,
        }
        createTrueOrFalse(body)
    }

    useEffect(() => {
        if (response.isSuccess) {
            const obj: gameObj = {
                name: response?.data?.name as string,
                slug: `/true-or-false/${response?.data?.slug}`,
                material: `https://fabricadejogos.portaleducacional.tec.br/game/true-or-false/${response?.data?.slug}`,
                disciplina_id: Number(discipline),
                series: serie,
            }
            createGameObject({ token, origin, ...obj })
        }
        response.isError && setAlert(getError(response.error))
    }, [response.isLoading])

    useEffect(() => {
        responsePortal.isSuccess && setOpen(true)
        responsePortal.isError && setAlert(getError(responsePortal.error))
    }, [responsePortal.isLoading])

    return (
        <>
            <SuccessModal open={open} handleClose={handleClose} />
            <BackFAButton />
            <Grid
                container
                marginTop={2}
                alignItems="center"
                justifyContent="center"
                direction="column"
                component="form"
                onSubmit={handleSubmit}
                spacing={2}
                textAlign="center"
            >
                <Grid item>
                    <Typography color="primary" variant="h2" component="h2">
                        <b>Verdadeiro ou Falso</b>
                    </Typography>
                </Grid>
                <Grid
                    item
                    container
                    direction={{ lg: 'row', md: 'column' }}
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                >
                    <Grid item justifyContent="flex-end" display="flex" lg={4} md={12}>
                        <SeriesSelect value={serie} setValue={setSerie} />
                    </Grid>
                    <Grid item lg={4} md={12}>
                        <TextField
                            label="Nome"
                            name="name"
                            variant="outlined"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                            sx={{ minWidth: { sm: 290, xs: 260 } }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item justifyContent="flex-start" display="flex" lg={4} md={12}>
                        <DisciplineSelect value={discipline} setValue={setDiscipline} />
                    </Grid>
                </Grid>
                <Grid item container alignItems="flex-start" justifyContent="center" spacing={5}>
                    <Grid item xs={12}>
                        <LayoutSelect value={layout} setValue={setLayout} />
                    </Grid>
                    {alert && (
                        <Grid item xs={12}>
                            <Alert
                                severity="warning"
                                onClick={() => {
                                    setAlert('')
                                }}
                            >
                                {alert}
                            </Alert>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button
                            onClick={handleCreateQuestion}
                            endIcon={<AddIcon fontSize="small" />}
                            variant="contained"
                        >
                            Adicionar Questão
                        </Button>
                    </Grid>
                    {questions.map((question: trueOrFalseQuestion, index: number) => {
                        return (
                            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                                <TrueOrFalseCell
                                    index={index}
                                    value={question}
                                    state={questions}
                                    setState={setQuestions}
                                />
                            </Grid>
                        )
                    })}
                </Grid>
                <Grid item xs={12}>
                    <Button size="large" type="submit" variant="outlined">
                        Criar
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}

export default NewTrueOrFalsePage
