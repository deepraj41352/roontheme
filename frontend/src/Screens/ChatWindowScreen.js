import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { IoSendSharp } from 'react-icons/io5';
import { RxFontStyle } from 'react-icons/rx';
import MyStatefulEditor from '../Components/rte_test';
import { Store } from '../Store';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'timeago.js';
import {
  BsDownload,
  BsFillMicFill,
  BsFillMicMuteFill,
  BsThreeDotsVertical,
} from 'react-icons/bs';
import { FiUpload } from 'react-icons/fi';
import Modal from 'react-bootstrap/Modal';
import { Audio, ColorRing, ThreeDots } from 'react-loader-spinner';
import Button from 'react-bootstrap/Button';
import { Editor } from '@tinymce/tinymce-react';
// import { EditorValue } from "react-rte";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { MdCancel } from 'react-icons/md';
import { FaArrowLeft, FaImage } from 'react-icons/fa';
import truncateText from '../TruncateText';
import { useTranslation } from 'react-i18next';

function ChatWindowScreen() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, userInfo, languageName } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [showFontStyle, setShowFontStyle] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [conversationID, setConversationID] = useState();
  const [projectData, SetProjectData] = useState();
  const [chatOpositeMember, SetChatOpositeMember] = useState();
  const [fileForModel, SetFileForModel] = useState(null);
  const [projectStatus, setProjectStatus] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedfile, setSelectedfile] = useState(null);
  const [selectedFileAudio, setSelectedFileAudio] = useState(null);
  const [selectedFileVideo, setSelectedFileVideo] = useState(null);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [editorCheck, setEditorCheck] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [MessageWithImage, setMessageWithImage] = useState('');
  const [senderInfo, SetSenderInfo] = useState({});
  const [showImage, setShowImage] = useState(false);
  const [connetct, setConnetct] = useState(false);
  const [mediaType, setMediaType] = useState('image');
  const audioChunks = useRef([]);
  const audioRef = useRef();
  const SocketUrl = process.env.REACT_APP_SOCKETURL;
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setConnetct(!connetct);
  }, [id]);

  useEffect(() => {
    if (selectedfile && selectedfile.type) {
      const mediaType =
        selectedfile.type.includes('video') ||
        selectedfile.type.includes('audio')
          ? 'video'
          : 'image';
      setMediaType(mediaType);
    }
  }, [selectedfile]);

  const scrollRef = useRef();

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(SocketUrl);
    socket.current.emit('addUser', userInfo._id, userInfo.role);

    socket.current.on('audio', (data) => {
      const audioBlob = new Blob([data.audio], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setArrivalMessage({
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        sender: data.senderId,
        audio: audioUrl,
        createdAt: Date.now(),
      });
      setAudioStream(data.audio);
    });
    socket.current.on('audioFile', (data) => {
      setArrivalMessage({
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        sender: data.senderId,
        audio: data.audio,
        createdAt: Date.now(),
      });
      setAudioStream(data.audio);
    });
    socket.current.on('video', (data) => {
      setArrivalMessage({
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        sender: data.senderId,
        video: data.video,
        createdAt: Date.now(),
      });
      setAudioStream(data.video);
    });

    socket.current.on('image', (data) => {
      setArrivalMessage({
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        sender: data.senderId,
        image: data.image,
        ImagewithMessage: data.ImagewithMessage,
        createdAt: Date.now(),
      });
    });
    socket.current.on('getMessage', (data) => {
      setArrivalMessage({
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);
  // }, []);

  useEffect(() => {
    const getSendRole = async () => {
      try {
        const { data } = await axios.get(
          '/api/user/role/' + arrivalMessage.sender
        );
        if (data.role === 'admin' || data.role === 'superadmin') {
          arrivalMessage &&
            setChatMessages((prev) => [...prev, arrivalMessage]);
        } else {
          arrivalMessage &&
            conversationID?.members.includes(arrivalMessage.sender) &&
            setChatMessages((prev) => [...prev, arrivalMessage]);
        }
      } catch (err) {
        console.log(err.response?.data?.message);
      }
    };
    getSendRole();
  }, [arrivalMessage, conversationID]);

  const startRecording = (e) => {
    e.preventDefault();

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };
        const receiverdId = conversationID.members.find(
          (member) => member !== userInfo._id
        );
        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: 'audio/wav',
          });
          if (userInfo.role === 'admin' || userInfo.role === 'superadmin') {
            const messageData = {
              senderFirstName: userInfo.first_name,
              senderLastName: userInfo.last_name,
              Sender_Profile: userInfo.profile_picture,
              senderId: userInfo._id,
              receiverdId: conversationID.members,
              audio: audioBlob,
            };
            socket.current.emit('audio', messageData);
            audioChunks.current.length = 0;
          } else {
            const messageData = {
              senderFirstName: userInfo.first_name,
              senderLastName: userInfo.last_name,
              Sender_Profile: userInfo.profile_picture,
              senderId: userInfo._id,
              receiverdId: receiverdId,
              audio: audioBlob,
            };
            socket.current.emit('audio', messageData);
            audioChunks.current.length = 0;
          }

          const formDatas = new FormData();
          formDatas.append('media', audioBlob);
          formDatas.append('mediaType', 'video');
          formDatas.append('conversationId', conversationID._id);
          // formDatas.append('conversationId', id);
          formDatas.append('sender', userInfo._id);
          formDatas.append('senderFirstName', userInfo.first_name);
          formDatas.append('senderLastName', userInfo.last_name);
          formDatas.append('Sender_Profile', userInfo.profile_picture);

          try {
            const { data } = await axios.post('/api/message/audio', formDatas);
          } catch (err) {
            console.log(err.response?.data?.message);
          }
        };

        recorder.start();
        setIsRecording(true);
      })
      .catch((error) => {
        console.error('Error accessing the microphone:', error);
        setIsRecording(false); // Ensure that the button is disabled in case of an error
      });
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(`/api/message/${id}`);
        setChatMessages(data);
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [conversation]);

  // for task
  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(`/api/message/${conversationID._id}`, {
          headers: { 'Accept-Language': languageName },
        });

        setChatMessages(data);
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [conversationID, languageName]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const { data } = await axios.post(`/api/conversation/${id}`);
        setConversationID(data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversation();
  }, []);

  // This is for Task
  useEffect(() => {
    const getConversation = async () => {
      try {
        const { data } = await axios.get(`/api/conversation/${id}`);
        setConversationID(data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversation();
  }, []);

  useEffect(() => {
    const GetProject = async () => {
      try {
        const { data } = await axios.get(`/api/task/${id}`);
        setProjectStatus(data.taskStatus);
        SetProjectData(data);
      } catch (err) {
        console.log(err);
      }
    };
    GetProject();
  }, [conversationID]);

  const handleStatusUpdate = async (e) => {
    setProjectStatus(e.target.value);
    try {
      const data = await axios.put(
        `/api/task/updateStatus/${projectData._id}`,
        { taskStatus: e.target.value },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (data.status === 200) {
        toast.success('Task Status updated Successfully !');
        toast.success(
          `${t('task')} ${t('status')} ${t('update successfully')}`
        );
      }
      setProjectStatus(data.projectStatus);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const receiverdId = conversationID?.members.find(
      (member) => member !== userInfo._id
    );
    console.log('receiverdId', receiverdId);
    const getChatMemberName = async () => {
      try {
        const { data } = await axios.get(`/api/user/${receiverdId}`);
        SetChatOpositeMember(data);
      } catch (err) {
        console.log(err);
      }
    };
    getChatMemberName();
  }, [conversationID]);

  useEffect(() => {
    const getChatMemberName = async () => {
      try {
        const senderIds = chatMessages.map((item) => item.sender);
        const { data } = await axios.get(`/api/user`);
        const filteredUsers = data.filter((user) =>
          senderIds.includes(user._id)
        );

        console.log('Filtered Users', filteredUsers);

        SetSenderInfo(filteredUsers);
      } catch (err) {
        console.log(err);
      }
    };
    getChatMemberName();
  }, [chatMessages]);

  const showFontStyleBox = () => {
    setShowFontStyle(!showFontStyle);
    setNewMessage('');
  };

  // const [messages, setMessages] = useState([]);
  const [clearEditor, setClearEditor] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const handleSendMessage = async () => {
    setMessageWithImage('');
    setClearEditor(true);
    setShowModal(false);
    const messageObject = {
      senderFirstName: userInfo.first_name,
      senderLastName: userInfo.last_name,
      text: newMessage,
      Sender_Profile: userInfo.profile_picture,
      sender: userInfo._id,
    };
    if (newMessage.trim() !== '') {
      setChatMessages([...chatMessages, messageObject]);
      setNewMessage('');
    }

    submitHandler();
  };
  const onChange = (value) => {
    setNewMessage(value);
  };
  const maxFileSizeBytes = 40 * 1024 * 1024; // 40 MB
  const isFileSizeValid = (file) => {
    return file?.size <= maxFileSizeBytes;
  };

  const handleFileChange = (e) => {
    if (e) {
      e.preventDefault();
    }
    const file = e.target.files[0];
    if (isFileSizeValid(file)) {
      SetFileForModel(file);
      setShowModal(true);
      e.target.value = null;
      if (file.type.includes('image')) {
        setSelectedfile(file);
      } else if (file.type.includes('audio')) {
        setSelectedFileAudio(file);
      } else if (file.type.includes('video')) {
        setSelectedFileVideo(file);
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result;

        //setSelectedImage(base64Data);
        if (file.type.includes('image')) {
          setSelectedImage(base64Data);
        } else if (file.type.includes('audio')) {
          setSelectedAudio(base64Data);
        } else if (file.type.includes('video')) {
          setSelectedVideo(base64Data);
        }
      };

      reader.readAsDataURL(file);
    } else if (file) {
      alert(t('imageSizeExceedsLimit'));
    }
  };

  const submitHandler = async (e) => {
    const receiverdId = conversationID.members.find(
      (member) => member !== userInfo._id
    );
    if (selectedImage) {
      const formDatas = new FormData();
      formDatas.append('media', selectedfile);
      formDatas.append('mediaType', mediaType);
      // formDatas.append('conversationId', id);
      formDatas.append('conversationId', conversationID._id);

      formDatas.append('sender', userInfo._id);
      formDatas.append('ImagewithMessage', MessageWithImage);
      formDatas.append('senderFirstName', userInfo.first_name);
      formDatas.append('senderLastName', userInfo.last_name);
      formDatas.append('Sender_Profile', userInfo.profile_picture);
      try {
        setIsSubmiting(true);
        const { data } = await axios.post('/api/message/', formDatas);
        if (userInfo.role === 'admin' || userInfo.role === 'superadmin') {
          const messageData = {
            senderFirstName: userInfo.first_name,
            senderLastName: userInfo.last_name,
            Sender_Profile: userInfo.profile_picture,
            senderId: userInfo._id,
            receiverdId: conversationID.members,
            image: data.image,
            ImagewithMessage: data.ImagewithMessage,
          };
          socket.current.emit('image', messageData);
        } else {
          const messageData = {
            senderFirstName: userInfo.first_name,
            senderLastName: userInfo.last_name,
            Sender_Profile: userInfo.profile_picture,
            senderId: userInfo._id,
            receiverdId: receiverdId,
            image: data.image,
            ImagewithMessage: data.ImagewithMessage,
          };
          socket.current.emit('image', messageData);
        }
        setIsSubmiting(false);
      } catch (err) {
        setIsSubmiting(false);

        console.log(err.response?.data?.message);
      }
      setSelectedImage(null);
    } else if (selectedAudio && selectedAudio != null) {
      if (userInfo.role === 'admin' || userInfo.role === 'superadmin') {
        const messageData = {
          senderFirstName: userInfo.first_name,
          senderLastName: userInfo.last_name,
          Sender_Profile: userInfo.profile_picture,
          senderId: userInfo._id,
          receiverdId: conversationID.members,
          audio: selectedAudio,
        };
        socket.current.emit('audioFile', messageData);
      } else {
        const messageData = {
          senderFirstName: userInfo.first_name,
          senderLastName: userInfo.last_name,
          Sender_Profile: userInfo.profile_picture,
          senderId: userInfo._id,
          receiverdId: receiverdId,
          audio: selectedAudio,
        };
        socket.current.emit('audioFile', messageData);
      }
      const formDatas = new FormData();
      formDatas.append('media', selectedFileAudio);
      formDatas.append('mediaType', 'video');
      // formDatas.append('conversationId', id);
      formDatas.append('conversationId', conversationID._id);
      formDatas.append('sender', userInfo._id);
      formDatas.append('text', newMessage);
      formDatas.append('senderFirstName', userInfo.first_name);
      formDatas.append('senderLastName', userInfo.last_name);
      formDatas.append('Sender_Profile', userInfo.profile_picture);
      try {
        const { data } = await axios.post('/api/message/audio', formDatas);
        setSelectedAudio(null);
      } catch (err) {
        console.log(err.response?.data?.message);
      }
    } else if (selectedVideo && selectedVideo != null) {
      const formDatas = new FormData();
      formDatas.append('media', selectedFileVideo);
      formDatas.append('mediaType', 'video');
      // formDatas.append('conversationId', id);
      formDatas.append('conversationId', conversationID._id);
      formDatas.append('sender', userInfo._id);
      formDatas.append('text', newMessage);
      formDatas.append('senderFirstName', userInfo.first_name);
      formDatas.append('senderLastName', userInfo.last_name);
      formDatas.append('Sender_Profile', userInfo.profile_picture);

      try {
        setIsSubmiting(true);
        const { data } = await axios.post('/api/message/video', formDatas);
        if (userInfo.role === 'admin' || userInfo.role === 'superadmin') {
          const messageData = {
            senderFirstName: userInfo.first_name,
            senderLastName: userInfo.last_name,
            Sender_Profile: userInfo.profile_picture,
            senderId: userInfo._id,
            receiverdId: conversationID.members,
            video: data.video,
          };
          socket.current.emit('video', messageData);
        } else {
          const messageData = {
            senderFirstName: userInfo.first_name,
            senderLastName: userInfo.last_name,
            Sender_Profile: userInfo.profile_picture,
            senderId: userInfo._id,
            receiverdId: receiverdId,
            video: data.video,
          };
          socket.current.emit('video', messageData);
        }
        setIsSubmiting(false);
      } catch (err) {
        console.log(err.response?.data?.message);
        setIsSubmiting(false);
      }

      setSelectedVideo(null);
    } else if (newMessage !== '') {
      if (userInfo.role === 'admin' || userInfo.role === 'superadmin') {
        socket.current.emit('sendMessage', {
          senderFirstName: userInfo.first_name,
          senderLastName: userInfo.last_name,
          Sender_Profile: userInfo.profile_picture,
          senderId: userInfo._id,
          receiverdId: conversationID.members,
          text: newMessage,
        });
      } else {
        socket.current.emit('sendMessage', {
          senderFirstName: userInfo.first_name,
          senderLastName: userInfo.last_name,
          Sender_Profile: userInfo.profile_picture,
          senderId: userInfo._id,
          receiverdId: receiverdId,
          text: newMessage,
        });
      }
      setEditorValue({ content: '' });
      try {
        const { data } = await axios.post('/api/message/', {
          senderFirstName: userInfo.first_name,
          senderLastName: userInfo.last_name,
          Sender_Profile: userInfo.profile_picture,
          // conversationId: id,
          conversationId: conversationID._id,
          sender: userInfo._id,
          text: newMessage,
        });
      } catch (err) {
        console.log(err.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, newMessage]);

  const handleClose = () => {
    setShowImage(false);
    setShowModal(false);
    setSelectedfile(null);
    setSelectedFileAudio(null);
    setSelectedFileVideo(null);
    setSelectedAudio(null);
    setSelectedImage(null);
    setSelectedVideo(null);
  };
  const handleforshowimage = (e) => {
    setShowImage(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };
  // const myTheme = createTheme({
  //   // Set up your custom MUI theme here
  // });

  const [editorValue, setEditorValue] = useState({ content: '' });
  const handleEditorChange = (data) => {
    // setEditorValue({content});
    setNewMessage(data);
  };

  const handleDownload = () => {
    // Create an invisible anchor element
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.target = '_blank';
    downloadLink.download = 'downloaded-image.png'; // Specify the desired file name

    // Simulate a click on the anchor element to trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleforsetImageclone = (img) => {
    setShowImage(true);
    setImageUrl(img);
  };
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className=" justify-content-center align-items-center">
      <div className="d-flex justify-content-center gap-3 ">
        <Card className="chatWindow">
          <CardHeader className={`d-flex ${theme}chatHead`}>
            {userInfo.role === 'admin' || userInfo.role === 'superadmin' ? (
              <Link to={`/admin/task-screen`}>
                <FaArrowLeft className={`me-3 fs-5 ${theme}backbtn `} />
              </Link>
            ) : userInfo.role === 'contractor' ? (
              <Link to={`/client/task-screen`}>
                <FaArrowLeft className={`me-3 fs-5 ${theme}backbtn `} />
              </Link>
            ) : (
              <Link to={`/agent/task-screen`}>
                <FaArrowLeft className={`me-3 fs-5 ${theme}backbtn `} />
              </Link>
            )}
            {projectData && (
              <div className={`TasknameNav me-3  ${theme}backbtn`}>
                {`${t('task')} ${t('name')}`} -
                {truncateText(projectData?.taskName, 30)}
              </div>
            )}
            <div className={`${theme}-threeDots`} onClick={toggleSidebar}>
              <BsThreeDotsVertical className="pt-1 threeDot" />
            </div>
          </CardHeader>
          {sidebarVisible ? (
            <div className="Chatside">
              <Card className={`chatWindowProjectInfo2 ${theme}chatInfo`}>
                {projectData ? (
                  <Form className="px-3">
                    <Form.Group
                      className={`mb-3 projetStatusChat ${theme}chat-info-inner`}
                    >
                      <div className="NameofOposite">
                        {' '}
                        {chatOpositeMember
                          ? chatOpositeMember.first_name
                          : null}
                      </div>
                      <div className="NameofOposite1">
                        {' '}
                        {chatOpositeMember
                          ? `(${chatOpositeMember.role})`
                          : null}
                      </div>
                      <div className="NameofOposite1">
                        {' '}
                        {chatOpositeMember ? chatOpositeMember.email : null}
                      </div>
                    </Form.Group>

                    <Form.Group
                      className={`mb-3 projetStatusChat ${theme}chat-info-inner`}
                    >
                      <div>
                        Project {`${t('name')}`} -{' '}
                        {truncateText(projectData?.projectName, 30)}
                      </div>
                    </Form.Group>
                    <Form.Group
                      className={`mb-3 projetStatusChat ${theme}chat-info-inner`}
                    >
                      <div className="taskDescription">
                        {`${t('task')} ${t('description')}`} -{' '}
                        {projectData?.taskDescription}
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3 " controlId="formBasicPassword">
                      <Form.Label className="mb-1 fw-bold">
                        {`${t('task')} ${t('status')}`}
                      </Form.Label>
                      <Form.Select
                        value={projectStatus}
                        onChange={handleStatusUpdate}
                      >
                        <option value="active">{t('running')}</option>
                        <option value="completed">{t('completed')}</option>
                        <option value="pending">{t('pending')}</option>
                      </Form.Select>
                    </Form.Group>
                  </Form>
                ) : (
                  <div className="d-flex mt-3 justify-content-center">
                    <ThreeDots
                      height="50"
                      width="50"
                      radius="9"
                      className="ThreeDot  justify-content-center"
                      color={theme == 'dark' ? 'white' : '#0e0e3d'}
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClassName=""
                      visible={true}
                    />
                  </div>
                )}
              </Card>
            </div>
          ) : (
            ''
          )}
          <CardBody className={`chatWindowBody ${theme}chatBody pb-0`}>
            {chatMessages.map((item) => (
              <>
                {userInfo._id == item.sender ? (
                  <>
                    {item.text ? (
                      <div
                        ref={scrollRef}
                        className="chat-receiverMsg d-flex flex-column"
                      >
                        <div className="d-flex w-100 justify-content-end">
                          <div className="d-flex flex-column forWidth ">
                            <div className="text-start d-flex justify-content-end  px-2 timeago2">
                              {item.senderFirstName} {item.senderLastName}
                            </div>
                            <div>
                              <p
                                className={`text-end chat-receiverMsg-inner ${theme}MsgThemeR p-2 px-3 mb-0`}
                                dangerouslySetInnerHTML={{ __html: item.text }}
                              ></p>
                            </div>
                            <div className="timeago text-end mb-3 ">
                              {format(item.createdAt)}
                            </div>
                          </div>

                          <div>
                            {senderInfo.map((user) => {
                              if (user._id === item.sender) {
                                return (
                                  <img
                                    key={user._id}
                                    className="chat-dp"
                                    src={
                                      user.profile_picture
                                        ? user.profile_picture
                                        : './avatar.png'
                                    }
                                    alt="Profile"
                                  />
                                );
                              } else {
                                return null;
                              }
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          ref={scrollRef}
                          className="chat-receiverMsg d-flex flex-row"
                        >
                          <div className="w-100 mediachats">
                            <div className="d-flex flex-row">
                              <div className="text-start px-2 timeago2">
                                {item.senderFirstName} {item.senderLastName}
                              </div>
                            </div>
                            {item.audio ? (
                              <audio
                                className="chat-receiverMsg-inner w-100 p-2"
                                controls
                              >
                                <source src={item.audio} type="audio/wav" />
                              </audio>
                            ) : (
                              <>
                                {item.video ? (
                                  <video
                                    className="chat-receiverMsg-inner w-100 p-2"
                                    controls
                                  >
                                    <source src={item.video} type="video/mp4" />
                                  </video>
                                ) : (
                                  <>
                                    <div className="Imagewithmessage-sender p-2">
                                      <FaImage
                                        className="icon-of-image"
                                        onClick={() =>
                                          handleforsetImageclone(item.image)
                                        }
                                      />
                                      <p className=" messageimg">
                                        {item.ImagewithMessage}
                                      </p>
                                    </div>
                                  </>
                                )}
                              </>
                            )}

                            <div className="timeago">
                              {format(item.createdAt)}
                            </div>
                          </div>
                          {senderInfo.map((user) => {
                            if (user._id === item.sender) {
                              return (
                                <img
                                  key={user._id}
                                  className="chat-dp"
                                  src={
                                    user.profile_picture
                                      ? user.profile_picture
                                      : './avatar.png'
                                  }
                                  alt="Profile"
                                />
                              );
                            } else {
                              return null;
                            }
                          })}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {item.text ? (
                      <div
                        ref={scrollRef}
                        className="chat-senderMsg d-flex flex-column "
                      >
                        <div className="d-flex w-100">
                          <div>
                            {senderInfo.map((user) => {
                              if (user._id === item.sender) {
                                return (
                                  <img
                                    key={user._id}
                                    className="chat-dp"
                                    src={
                                      user.profile_picture
                                        ? user.profile_picture
                                        : './avatar.png'
                                    }
                                    alt="Profile"
                                  />
                                );
                              } else {
                                return null;
                              }
                            })}
                          </div>
                          <div className="d-flex flex-column  forWidth  ">
                            <div className="text-start px-2 timeago2">
                              {item.senderFirstName} {item.senderLastName}{' '}
                            </div>
                            <div>
                              <p
                                className={`chat-senderMsg-inner ${theme}MsgThemeS p-2 px-3 mb-0`}
                                dangerouslySetInnerHTML={{ __html: item.text }}
                              ></p>
                            </div>
                            <div className="timeago text-start mb-3 ">
                              {format(item.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        ref={scrollRef}
                        className="chat-senderMsg d-flex flex-row "
                      >
                        <b>{item.senderId}</b>
                        {senderInfo.map((user) => {
                          if (user._id === item.sender) {
                            return (
                              <img
                                key={user._id}
                                className="chat-dp"
                                src={
                                  user.profile_picture
                                    ? user.profile_picture
                                    : './avatar.png'
                                }
                                alt="Profile"
                              />
                            );
                          } else {
                            return null;
                          }
                        })}
                        <div className="w-100">
                          <div className="d-flex flex-row">
                            <div className="text-start px-2 timeago2">
                              {item.senderFirstName} {item.senderLastName}
                            </div>
                          </div>

                          {item.audio ? (
                            <audio
                              className="chat-senderMsg-inner w-100 p-2"
                              controls
                            >
                              <source src={item.audio} type="audio/wav" />
                            </audio>
                          ) : (
                            <>
                              {item.video ? (
                                <video
                                  className="chat-senderMsg-inner w-100 p-2"
                                  controls
                                >
                                  <source src={item.video} type="video/mp4" />
                                </video>
                              ) : (
                                <>
                                  <div className="Imagewithmessage-reciver p-2">
                                    <FaImage
                                      className="icon-of-image"
                                      onClick={() =>
                                        handleforsetImageclone(item.image)
                                      }
                                    />
                                    <p className="messageimg1">
                                      {item.ImagewithMessage}
                                    </p>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                          <div className="text-start timeago">
                            {format(item.createdAt)}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            ))}

            <Modal
              className="modal-content1 d-flex align-items-center"
              show={showImage}
              onHide={handleClose}
            >
              <MdCancel className="close-button" onClick={handleClose} />

              <div className="mx-auto">
                <img className="w-100" src={imageUrl} />
                <BsDownload
                  className="btn-send downloadBtn"
                  onClick={handleDownload}
                />
              </div>
            </Modal>
          </CardBody>
          <CardFooter
            className={`d-flex justify-content-center align-items-center ${theme}chatFoot`}
          >
            <Form className="w-100">
              <InputGroup
                className={`input-text-edit-mob ${
                  showFontStyle && 'input-text-edit'
                }`}
              >
                <input
                  disabled={isSubmiting}
                  type="text"
                  style={{
                    display: showFontStyle ? 'none' : 'block',
                  }}
                  placeholder={t('messagePlaceholder')}
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                  onKeyPress={handleKeyPress}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="inputBox-chat"
                />
                <div
                  style={{ display: showFontStyle ? 'block' : 'none' }}
                  className="richEditor pr-2"
                >
                  <MyStatefulEditor
                    markup=""
                    clearEditor={clearEditor}
                    setClearEditor={setClearEditor}
                    onChange={onChange}
                  />
                </div>
                <div className="d-flex justify-content-end align-items-center gap-2 ms-3 p-2">
                  <Form.Group>
                    <Form.Label htmlFor="file-input" className="m-0">
                      <FiUpload />
                    </Form.Label>
                    <Form.Control
                      style={{ display: 'none' }}
                      id="file-input"
                      type="file"
                      disabled={isSubmiting}
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <div>
                    <BsFillMicFill
                      onClick={startRecording}
                      disabled={isRecording}
                      style={{ display: isRecording ? 'none' : 'block' }}
                    />

                    <BsFillMicMuteFill
                      onClick={stopRecording}
                      disabled={!isRecording}
                      style={{ display: !isRecording ? 'none' : 'block' }}
                    />
                    <div
                      onClick={stopRecording}
                      disabled={!isRecording}
                      style={{ display: !isRecording ? 'none' : 'block' }}
                    >
                      <Audio
                        height="25"
                        width="25"
                        color={theme == 'dark' ? 'white' : '#07162c'}
                        ariaLabel="audio-loading"
                        wrapperStyle={{}}
                        wrapperClass="wrapper-class"
                        visible={true}
                      />
                    </div>
                  </div>
                  <div>
                    <RxFontStyle
                      className="w-100 rxfontstryle"
                      onClick={showFontStyleBox}
                    />
                  </div>
                  {isSubmiting ? (
                    <ColorRing
                      visible={true}
                      height="40"
                      width="40"
                      ariaLabel="blocks-loading"
                      wrapperStyle={{}}
                      wrapperClass="blocks-wrapper"
                      colors={
                        toggleState
                          ? ['white', 'white', 'white', 'white', 'white']
                          : [
                              'rgba(0, 0, 0, 1) 0%',
                              'rgba(17, 17, 74, 1) 68%',
                              'rgba(0, 0, 0, 1) 93%',
                            ]
                      }
                    />
                  ) : (
                    <IoSendSharp
                      disabled={true}
                      className="ms-3"
                      onClick={handleSendMessage}
                    />
                  )}
                </div>
              </InputGroup>
            </Form>
          </CardFooter>
        </Card>
        <Card className={`chatWindowProjectInfo ${theme}chatInfo`}>
          {projectData ? (
            <Form className="px-3 chatWindowProjectInfoForm ">
              <Form.Group
                className={`mb-3 projetStatusChat ${theme}chat-info-inner`}
              >
                <div className="NameofOposite">
                  {' '}
                  {chatOpositeMember ? chatOpositeMember.first_name : null}
                </div>
                <div className="NameofOposite1">
                  {' '}
                  {chatOpositeMember ? `(${chatOpositeMember.role})` : null}
                </div>
                <div className="NameofOposite1">
                  {' '}
                  {chatOpositeMember ? chatOpositeMember.email : null}
                </div>
              </Form.Group>
              <Form.Group
                className={`mb-3 projetStatusChat ${theme}chat-info-inner`}
              >
                <div>
                  Project {`${t('name')}`} - {projectData?.projectName}{' '}
                </div>
              </Form.Group>
              <Form.Group
                className={`mb-3 projetStatusChat ${theme}chat-info-inner`}
              >
                <div className="taskDescription">
                  {`${t('task')} ${t('description')}`} -{' '}
                  {projectData?.taskDescription}
                </div>
                {/* </>
                )} */}
              </Form.Group>
              <Form.Group className="mb-3 " controlId="formBasicPassword">
                <Form.Label className="mb-1 fw-bold">
                  {' '}
                  {`${t('task')} ${t('status')}`}
                </Form.Label>
                <Form.Select
                  value={projectStatus}
                  onChange={handleStatusUpdate}
                >
                  <option value="active">{t('running')}</option>
                  <option value="completed">{t('completed')}</option>
                  <option value="pending">{t('pending')}</option>
                </Form.Select>
              </Form.Group>
            </Form>
          ) : (
            <div className="d-flex mt-3 justify-content-center">
              <ThreeDots
                height="50"
                width="50"
                radius="9"
                className="ThreeDot  justify-content-center"
                color={theme == 'dark' ? 'white' : '#0e0e3d'}
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
              />
            </div>
          )}
        </Card>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t('fileSelected')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t('fileSelectedMessage')}
          <h4> {fileForModel?.name}</h4>
          {fileForModel?.type.includes('image') && (
            <Form.Control
              disabled={isSubmiting}
              type="text"
              style={{ display: showFontStyle ? 'none' : 'block' }}
              placeholder={t('messagePlaceholder')}
              aria-label="Search"
              aria-describedby="basic-addon2"
              onKeyPress={handleKeyPress}
              value={MessageWithImage}
              onChange={(e) => setMessageWithImage(e.target.value)}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-send" onClick={handleSendMessage}>
            {t('send')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ChatWindowScreen;
