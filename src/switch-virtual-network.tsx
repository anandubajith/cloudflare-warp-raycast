import { Action, ActionPanel, List, Toast, closeMainWindow, showToast } from "@raycast/api";
import { useEffect, useState } from "react";
import { VirtualNetwork, getVirtualNetworks, switchVirtualNetwork } from "./lib";

const ListItem = ({
  virtualNetwork,
  onSwitchVirtualNetwork,
}: {
  virtualNetwork: VirtualNetwork;
  onSwitchVirtualNetwork: (id: string) => void;
}) => {
  const accessories = [];
  if (virtualNetwork.active) {
    accessories.push({ text: "Active" });
  }
  if (virtualNetwork.default) {
    accessories.push({ text: "Default" });
  }

  return (
    <List.Item
      key={virtualNetwork.id}
      id={virtualNetwork.id}
      title={virtualNetwork.name}
      subtitle={virtualNetwork.comment}
      actions={
        <ActionPanel title="Actions">
          <Action onAction={() => onSwitchVirtualNetwork(virtualNetwork.id)} title="Switch" />
        </ActionPanel>
      }
      accessories={accessories}
    />
  );
};

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<VirtualNetwork[]>([]);

  useEffect(() => {
    setIsLoading(true);
    getVirtualNetworks()
      .then((res) => setItems(res))
      .then(() => setIsLoading(false));
  }, []);

  const onSwitchVirtualNetwork = async (id: string) => {
    await switchVirtualNetwork(id);
    await showToast({
      style: Toast.Style.Success,
      title: "Switched Virtual Network",
    });
    await closeMainWindow();
  };
  if (!isLoading && items.length === 0) {
    return (
      <List
        navigationTitle="Switch Virtual Network"
        searchBarPlaceholder="Search Virtual Networks"
        isLoading={isLoading}
      >
        <List.EmptyView title="No Virtual Networks found" />;
      </List>
    );
  }

  return (
    <List navigationTitle="Switch Virtual Network" searchBarPlaceholder="Search Virtual Networks" isLoading={isLoading}>
      {items.map((item: VirtualNetwork) => (
        <ListItem key={item.id} virtualNetwork={item} onSwitchVirtualNetwork={onSwitchVirtualNetwork} />
      ))}
    </List>
  );
};
