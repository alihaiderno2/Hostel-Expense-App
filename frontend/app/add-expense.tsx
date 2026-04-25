import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  SafeAreaView, 
  ActivityIndicator,
  Touchable
  , TouchableOpacity
} from "react-native";
import { Colors } from "../constants/Colors"; 
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {api} from "../services/api";

export default function AddExpenseScreen() {
    const router = useRouter();
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");

    // States for the group selection dropdown
    const [groups, setGroups] = useState<{ _id: string; name: string }[]>([]); // This will hold the list of groups fetched from the API
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);
    
    // States for the group Members
    const [members, setMember] = useState<{_id: string,name: string}[]>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try{
                const res = await api.get('/auth/me');
                setGroups(res.data.groups);

                if(res.data.groups.length > 0){
                    setSelectedGroupId(res.data.groups[0]._id); 
                }
        }catch(err){
                console.error("Failed to fetch groups:", err);
            }finally{
                setIsLoadingGroups(false);
            }
        };
        fetchGroups();
    }, []);

    useEffect(() => {
        const fetchGroupMembers = async () => {
            if(!selectedGroupId) return;

            try{
                const res  = await api.get(`/groups/${selectedGroupId}`);
                setMember(res.data.members);
            }
            catch(err){
                console.error("Failed to fetch group members:", err);
            }finally{
                setIsLoadingMembers(false);
            }
        };
        fetchGroupMembers();
    }, [selectedGroupId]);
    const handleSave = async () => {
        // API logic will go here
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Add New Expense</Text>
            </View>

            {/* 3. The Form Body */}
            <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

                <View style = {styles.inputGroup}>
                    <Text style={styles.label}>Select Group</Text>
                    {isLoadingGroups ? (
                        <ActivityIndicator size="small" color="#000" style={{alignSelf: 'flex-start'}} />
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupScroll}>
                            {groups.map(group => (
                                <TouchableOpacity
                                    key={group._id}
                                    style={[
                                        styles.groupChip ,
                                        selectedGroupId === group._id && styles.groupChipSelected
                                    ]}
                                    onPress={() => setSelectedGroupId(group._id)}
                                >
                                    <Text style={[
                                        styles.groupChipText,
                                        selectedGroupId === group._id && styles.groupChipTextSelected
                                    ]}>{group.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="What was this expense for?"
                        placeholderTextColor={Colors.text.secondary}
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Total Amount</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="How much did it cost?"
                        placeholderTextColor={Colors.text.secondary} 
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />
                </View>

                <View style= {styles.inputGroup}>
                    <Text style={styles.label}>Select Payers</Text>
                    {isLoadingMembers ? (
                        <ActivityIndicator size="small" color="#000" style={{alignSelf: 'flex-start'}} />
                    ) : (
                        <View style = {styles.membersContainer}>
                            {members.map(member => (
                                <View key={member._id} style={styles.memberRow}>
                                    <View style = {styles.avatar}> 
                                        <Text style = {styles.avatarText}>{member.name.charAt(0).toUpperCase()}</Text> 
                                    </View>

                                <Text style={styles.memberName}>{member.name}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: Colors.background.main
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE', 
    backgroundColor: '#FFF',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#000'
  },
  container: { 
    flex: 1, 
    padding: 20, 
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    fontWeight: '700',
    textTransform: 'uppercase', 
    letterSpacing: 0.5,
  },
  input: { 
    borderBottomWidth: 1, 
    borderBottomColor: '#CCC', 
    paddingVertical: 10, 
    fontSize: 18,
    color: '#000',
  },
  groupScroll: {
      flexDirection: 'row',
      paddingBottom: 8,
  },
  groupChip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: '#F5F5F5',
      marginRight: 10,
      borderWidth: 1,
      borderColor: '#EEE',
  },
  groupChipSelected: {
      backgroundColor: '#000',
      borderColor: '#000',
  },
  groupChipText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#666',
  },
  groupChipTextSelected: {
      color: '#FFF',
  },
  membersContainer: {
      backgroundColor: '#F9F9F9',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: '#EEE',
  },
  memberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#EEE',
  },
  avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
  },
  avatarText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 16,
  },
  memberName: {
      fontSize: 16,
      color: '#333',
      fontWeight: '500',
  }
});