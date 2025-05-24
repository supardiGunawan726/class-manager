import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shuffleArray } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

function getInitialGroups(
  users,
  { divide_with, numbers_of_group, numbers_of_group_member }
) {
  const numbersOfGroup =
    divide_with === "numbers_of_group"
      ? numbers_of_group
      : Math.ceil(users.length / numbers_of_group_member);
  const numbersOfGroupMember = Math.ceil(users.length / numbersOfGroup);

  const groups = {};

  for (let i = 0; i < numbersOfGroup; i++) {
    const group = {};
    for (let j = 0; j < numbersOfGroupMember; j++) {
      group[j] = null;
    }
    groups[i] = group;
  }

  return groups;
}

export function GroupsGenerator({ users }) {
  const groupsContainerRef = useRef(null);

  const [values, setValues] = useState({
    divide_with: "numbers_of_group",
    numbers_of_group: 1,
    numbers_of_group_member: users.length,
  });
  const [groups, setGroups] = useState(getInitialGroups(users, values));

  const unselectedUsers = useMemo(() => {
    let selectedUsers = [];

    for (const group of Object.keys(groups)) {
      selectedUsers = selectedUsers.concat(
        Object.values(groups[group]).filter(Boolean)
      );
    }

    const unselectedUsers = users.filter(
      (user) => !selectedUsers.some((selectedUser) => selectedUser === user.uid)
    );
    return unselectedUsers;
  }, [groups, users]);

  useEffect(() => {
    if (groupsContainerRef.current) {
      groupsContainerRef.current.style.maxWidth = `${groupsContainerRef.current.scrollWidth}px`;
    }
  }, []);

  function handleDivideWithChange(value) {
    setValues((prev) => ({ ...prev, divide_with: value }));
    setGroups(getInitialGroups(users, { ...values, divide_with: value }));
  }

  function handleNumbersOfGroupChange(e) {
    const numbers_of_group = e.target.valueAsNumber;
    const numbers_of_group_member = Math.ceil(users.length / numbers_of_group);

    const newValues = { ...values, numbers_of_group, numbers_of_group_member };

    setValues(newValues);
    setGroups(getInitialGroups(users, newValues));
  }

  function handlehandleNumbersOfGroupMemberChange(e) {
    const numbers_of_group_member = e.target.valueAsNumber;
    const numbers_of_group = Math.ceil(users.length / numbers_of_group_member);

    const newValues = { ...values, numbers_of_group, numbers_of_group_member };

    setValues(newValues);
    setGroups(getInitialGroups(users, newValues));
  }

  function handleSelectUser(group, order) {
    return (value) => {
      setGroups((prev) => ({
        ...prev,
        [group]: { ...prev[group], [order]: value },
      }));
    };
  }

  function handleReset() {
    setGroups(getInitialGroups(users, values));
  }

  function getUserByUid(uid) {
    return users.find((user) => user.uid === uid);
  }

  function fillGroupMembers() {
    const randomizeUnselectedUsers = shuffleArray(unselectedUsers);

    const newGroups = { ...groups };

    let i = 0;
    for (const group of Object.keys(newGroups)) {
      for (const memberIndex of Object.keys(groups[group])) {
        newGroups[group][memberIndex] = newGroups[group][memberIndex]
          ? newGroups[group][memberIndex]
          : randomizeUnselectedUsers[i++]?.uid;
      }
    }

    setGroups(newGroups);
  }

  return (
    <div className="grid gap-4">
      <form className="grid grid-cols-2">
        <div className="grid gap-4">
          <div className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="divide_with" className="text-right col-span-2">
              Bagi dengan
            </Label>
            <Select
              name="divide_with"
              value={values.divide_with}
              onValueChange={handleDivideWithChange}
            >
              <SelectTrigger id="divide_with" className="col-span-3">
                <SelectValue placeholder="bagi dengan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="numbers_of_group">
                  Jumlah kelompok
                </SelectItem>
                <SelectItem value="numbers_of_group_member">
                  Jumlah anggota perkelompok
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {values.divide_with === "numbers_of_group" && (
            <div className="grid grid-cols-5 items-center gap-4">
              <Label
                htmlFor="numbers_of_group"
                className="text-right col-span-2"
              >
                Jumlah kelompok
              </Label>
              <Input
                type="number"
                id="numbers_of_group"
                name="numbers_of_group"
                className="col-span-3"
                min={1}
                max={users.length}
                value={values.numbers_of_group}
                onChange={handleNumbersOfGroupChange}
              />
            </div>
          )}
          {values.divide_with === "numbers_of_group_member" && (
            <div className="grid grid-cols-5 items-center gap-4">
              <Label
                htmlFor="numbers_of_group_member"
                className="text-right col-span-2"
              >
                Jumlah anggota perkelompok
              </Label>
              <Input
                type="number"
                id="numbers_of_group_member"
                name="numbers_of_group_member"
                className="col-span-3"
                min={1}
                max={users.length}
                value={values.numbers_of_group_member}
                onChange={handlehandleNumbersOfGroupMemberChange}
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="button" onClick={fillGroupMembers}>
            Buat kelompok
          </Button>
        </div>
      </form>
      <p className="col-span-full text-slate-500 text-sm max-w-xl">
        Tips: kamu bisa menambahkan anggota tertentu ke suatu kelompok secara
        manual, misal kamu ingin menambahkan ketua kelompok.
      </p>
      <div ref={groupsContainerRef}>
        <ScrollArea className="w-full">
          <ScrollBar orientation="horizontal" />
          <div className="flex gap-8 overflow-x-auto">
            {Object.keys(groups).map((group) => (
              <div key={group} className="w-40">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-center">
                        Kelompok {parseInt(group) + 1}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(groups[group]).map((memberIndex) => (
                      <TableRow
                        className="hover:bg-transparent"
                        key={memberIndex}
                      >
                        <TableCell className="text-center">
                          <div className="grid place-items-center">
                            <Select
                              value={groups[group][memberIndex]}
                              onValueChange={handleSelectUser(
                                group,
                                memberIndex
                              )}
                            >
                              <SelectTrigger className="border-0 w-max disabled:opacity-100 disabled:cursor-default">
                                {getUserByUid(groups[group][memberIndex])?.name}
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={null}>-</SelectItem>
                                {unselectedUsers.map((unselectedUser) => (
                                  <SelectItem
                                    key={unselectedUser.uid}
                                    value={unselectedUser.uid}
                                  >
                                    {unselectedUser.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
