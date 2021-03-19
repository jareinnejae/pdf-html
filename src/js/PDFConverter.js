import React, { Component, Fragment } from "react";
import env from "react-dotenv";

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'

class PDFConverter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isConvertingFile: false,
            pdf_file: null,
            data: null,
            file_url: ""
        }

    }

    componentDidMount() {
    }

    convertFile = async () => {
        this.setState({
            isConvertingFile: true
        });
        await fetch('https://api.pdf.co/v1/pdf/convert/to/html?url='+this.state.file_url, {
            method: 'POST',
            headers: {
                'x-api-key': env.API_KEY
            }
        })
        .then(response => response.json())
        .then(data => {
            this.downloadURL(data['url']);
            this.setState({
                isConvertingFile: false
            });
        })
    }


    finalizeGeneratedHTML = (file) => {
        var link = document.createElement("a");
        link.href = file;
        link.target="_blank";
        link.setAttribute("download", "view.html");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    downloadURL = (url) => {
        fetch(url, {
            method: 'GET',
        }).then(function(resp) {
            return resp.blob();
        }).then(function(blob) {
            const newBlob = new Blob([blob], { type: "application/html", charset: "UTF-8" })
            
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }
            const data = window.URL.createObjectURL(newBlob);
            const link = document.createElement('a');
            link.dataType = "json";
            link.href = data;
            link.download = "file.html";
            link.dispatchEvent(new MouseEvent('click'));
            setTimeout(function () {
                window.URL.revokeObjectURL(data)
            });
        });

    };

    render() {
        return (
            <div>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>URL</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter pdf url" 
                            onChange={(e) => {
                                this.setState({
                                    file_url: e.target.value
                                })
                            }}
                        />
                    </Form.Group>
                </Form>
                <Button
                    variant="primary"
                    disabled={this.state.isConvertingFile}
                    onClick={this.convertFile}
                >
                    {
                        this.state.isConvertingFile ? 
                            <Fragment>
                                <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                /> 
                                Loading...
                            </Fragment> :
                            "Generate HTML file"
                    }
                </Button>
            </div>
        );
    }
}

export default PDFConverter;
