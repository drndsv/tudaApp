// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Box,
//   Button,
//   Center,
//   Container,
//   Grid,
//   Paper,
//   Stack,
//   Text,
//   TextInput,
//   Title,
// } from "@mantine/core";
// import Header from "../components/Header";
// import { AccountingAppUserResponseDTO } from "../api/generated/models/AccountingAppUserResponseDTO";
// import { AccountingAppUserControllerService } from "../api/generated/services/AccountingAppUserControllerService";
// import { EventControllerService } from "../api/generated/services/EventControllerService";

// export default function ParticipantsPage() {
//   const { id } = useParams(); // id мероприятия из URL
//   const [participants, setParticipants] = useState<
//     AccountingAppUserResponseDTO[]
//   >([]);
//   const [eventTitle, setEventTitle] = useState("");

//   // Получаем мероприятие
//   useEffect(() => {
//     if (!id) return;

//     EventControllerService.getEventById(Number(id)).then((res) => {
//       if (res.data?.title) {
//         setEventTitle(res.data.title);
//       }
//     });
//   }, [id]);

//   // Загружаем участников
//   useEffect(() => {
//     if (!id) return;

//     // Ты можешь переименовать метод под нужный тебе, если getAllByEventId нет
//     fetch(`/api/accountingAppUser/getByEventId?eventId=${id}`)
//       .then((res) => res.json())
//       .then((data) => setParticipants(data.data || []))
//       .catch((err) => console.error("Ошибка загрузки участников:", err));
//   }, [id]);

//   const getFullName = (u?: any) => {
//     if (!u) return "—";
//     return `${u.lastName || ""} ${u.name || ""} ${u.patronymic || ""}`.trim();
//   };

//   return (
//     <Box bg="cream.0" style={{ minHeight: "100vh" }}>
//       <Header />
//       <Container size="lg" py="xl">
//         <Title order={2} mb="lg">
//           Участники мероприятия: {eventTitle}
//         </Title>

//         <TextInput placeholder="Найти по ФИО" mb="md" />

//         <Grid mb="md">
//           <Grid.Col span={6}>
//             <Button variant="default" fullWidth>
//               Все роли
//             </Button>
//           </Grid.Col>
//           <Grid.Col span={6}>
//             <Button variant="default" fullWidth>
//               Все статусы
//             </Button>
//           </Grid.Col>
//         </Grid>

//         <Stack gap="sm">
//           {participants.length === 0 ? (
//             <Center>
//               <Text>Нет участников</Text>
//             </Center>
//           ) : (
//             participants.map((p) => (
//               <Paper key={p.keyId} shadow="xs" p="md" withBorder>
//                 <Grid align="center">
//                   <Grid.Col span={5}>
//                     <Text>{getFullName(p.appUser)}</Text>
//                   </Grid.Col>
//                   <Grid.Col span={4}>
//                     <Text>{p.userRole}</Text>
//                   </Grid.Col>
//                   <Grid.Col span={3}>
//                     <Text>{p.status ? "Пришел" : "Не пришел"}</Text>
//                   </Grid.Col>
//                 </Grid>
//               </Paper>
//             ))
//           )}
//         </Stack>
//       </Container>
//     </Box>
//   );
// }
